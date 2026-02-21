# File Upload Flow

This document explains how file uploads (resume) move through the backend, what validations are applied, and where each layer participates (routes → middleware → controller → service → storage utilities → provider → repository/ORM → database). It also notes deletion/rollback behavior. A block diagram and expected responsibility split (client vs controller vs service) are included to align with production-grade patterns.

## High-Level Sequence
1) **Route** (`/v1/job-seeker/resume`): Auth + role guard, then `uploadSingle('resume')`, then controller handler.
2) **Upload middleware** (`uploadSingle`): Multer memory storage, no size/type limits today; converts Multer errors to `AppError`.
3) **Controller**: Passes `req.user.id` and `req.file` to the service; responds with `resume_url` from the service result.
4) **Service**:
   - Validates file presence.
   - Validates existing job seeker profile.
   - Builds upload options from policy (folder, resource type, publicId = sanitized userId/resume).
   - Calls storage utility `uploadFile`.
   - Updates DB resume URL via repository.
   - On DB error, calls storage utility `deleteFile` to roll back.
5) **Storage utility** (`uploadFile` / `deleteFile`): Picks provider from `STORAGE_PROVIDER` env; delegates to provider implementation; returns file id + URL.
6) **Provider (Cloudinary)**: Streams buffer to Cloudinary; sets folder/resource type/publicId; returns `public_id` + `secure_url`; `deleteFile` removes by id.
7) **Repository/ORM**: Prisma update on `jobSeeker.resume_url` for the current `user_id`.
8) **Database**: Persisted row change in `jobSeeker.resume_url`.

## Block Diagram (end-to-end)

```
Client (selects PDF resume)
   |
   v
Route (Express + auth/role)
   |
   v
Upload MW (multer uploadSingle 'resume')
   |
   v
Controller (user-facing mapping)
   |
   v
Service (server-side validation + orchestration)
   |
   v
Storage utils (uploadFile/deleteFile, choose provider)
   |
   v
Provider (Cloudinary: stream buffer, set folder/public_id)
   |
   v
Repository/ORM (Prisma update resume_url)
   |
   v
Database
   |
   v
Controller response -> Client
```

## Validations and Guards (Current State)
- **Auth/Role**: `authMiddleware` + `requireJobSeeker` gate the route.
- **File presence**: Service throws `NO_FILE_UPLOADED` if `req.file` is missing.
- **Profile existence**: Service ensures job seeker profile exists before upload/update.
- **Identifier safety**: `sanitizeIdentifier` strips unsafe chars from `userId`; empty result triggers `FILE_NOT_FOUND` error.
- **Storage provider selection**: `uploadFile` errors if `STORAGE_PROVIDER` env is missing/unknown.
- **Provider-level errors**: Multer errors mapped to `AppError`; Cloudinary upload/delete errors mapped to `AppError`.
- **Rollback safety**: On DB update failure after successful upload, service attempts `deleteFile` to clean up remote asset.

## Policy Reference (resume)
- Folder: `resumes`
- Resource type: `auto`
- Allowed formats: `pdf`
- Allowed MIME types: `application/pdf`
- Max bytes: `5 MB`

> Note: Allowed formats/MIME/max size are defined but not enforced yet by middleware or service.

## Correct Handling Expectations (production-grade)

- **Client-side (not in repo)**: Restrict picker to PDF; show size limit; preflight before upload; surface friendly errors.
- **Controller (edge, user-facing)**:
   - Validate request shape quickly; short-circuit obvious client mistakes (missing file field, wrong form key) with 4xx.
   - Map domain errors to stable API messages (e.g., `FILE_UPLOAD_MESSAGES`).
   - Do not enforce deep security/business rules here—delegate to service.
- **Service (authoritative, server-side validation)**:
   - Enforce policy: MIME/extension/size and only allowed resource type.
   - Require existing profile; sanitize identifiers; ensure deterministic `publicId`.
   - Orchestrate upload → DB update → rollback on failure.
   - Translate provider/DB errors to domain-safe errors; log with context.
- **Middleware**:
   - Enforce transport-level constraints: `limits.fileSize`, `fileFilter` for MIME/extension; reject oversize early before buffering huge payloads.
   - Normalize Multer errors into `AppError` for consistent handling.
- **Storage utils / Provider**:
   - Isolate provider-specific logic; ensure overwrite behavior is intentional; return canonical `fileId` and URL.
   - Convert provider errors to controlled errors; no raw provider leaks.
- **Repository/ORM**:
   - Single responsibility for persistence; never swallow errors.
   - Keep schema-aligned updates (`resume_url` only); rely on service for business validation.

## Potential Cases to Handle

- **Happy path**: Valid PDF under 5 MB → upload to Cloudinary with `public_id={sanitizedUserId}/resume` → DB `resume_url` updated → 200 with URL.
- **Missing file**: Multer didn’t parse file field or client omitted it → controller/service returns `NO_FILE_UPLOADED` 400.
- **Invalid MIME/extension** (to add): Middleware rejects with 400 before upload; service double-checks and rejects if it slipped through.
- **Oversized file** (to add): Multer `limits.fileSize` triggers error; mapped to 400; service also checks `file.size` <= policy.
- **Profile not found**: Service returns 404; no upload attempted (or upload then rollback if profile check ever moves).
- **DB write fails after upload**: Service calls `deleteFile(fileId)` to rollback; returns 500 with safe message; warns if cleanup fails.
- **Provider failure**: Upload/delete errors mapped to 500; no DB update occurs.
- **Sanitized user id empty**: Service returns 400 with clearer message (improve from current `FILE_NOT_FOUND`).

## Data Shapes
- **Upload input**: `Express.Multer.File` (buffer in memory).
- **Upload options**: `{ folder, resourceType, publicId }` built from policy + sanitized user id.
- **Provider result**: `{ id: public_id, url: secure_url }`.
- **Service DB update**: `{ resume_url: uploadResult.fileUrl }` on `jobSeeker` row.
- **API response**: `{ resume_url }` with HTTP 200 on success.

## Delete / Rollback Path
- **Trigger**: DB update failure after successful remote upload.
- **Action**: Service calls `deleteFile(uploadResult.fileId)`.
- **Provider**: Cloudinary `destroy(public_id)`; tolerates `not found` as non-fatal.
- **Logging**: Warn logged if cleanup fails.

## Suggested Hardening (next steps)
- Enforce policy limits in middleware (`limits.fileSize`) and `fileFilter` for allowed MIME/extension.
- Add size/MIME check in service as defense in depth.
- Return clearer error when sanitized user id becomes empty.
- Add tests for: allowed/blocked file types, oversized files, rollback on DB failure, overwrite behavior with same publicId.
