Authentication
- Register & Login

- JWT-based authentication

- Email verification

- Forgot & reset password


Authorization

- Role-based access control:

  - student

  - instructor

  - admin

- Ownership validation (course owner only)

- Enrollment-based access


Course Features

- Create, update, delete course

- Publish & unpublish course

- Course visibility:

  - draft

  - published

- Instructor-only course management

- Public course listing (published only)


Lesson Features

- Create lesson with auto-increment order_number

- Update lesson content

- Publish & unpublish lesson

- Preview lesson (is_preview)

- Delete lesson with safe reordering

- Update lesson order using transaction (BEGIN / COMMIT / ROLLBACK)


Learning & Progress System

- Enroll / unenroll course

- Mark lesson as completed

- Lesson completion validation

- Course progress percentage

- Lesson locking:

  - User must complete previous lesson first

- Unique constraints to prevent duplicate progress data

Tech Stack

- Node.js

- Express.js

- PostgreSQL

- JWT Authentication

- bcrypt

- Nodemailer (email verification & reset password)

Author :
Vino Fernando


Notes

This project is part of a fullstack learning journey and will be integrated with a frontend application in the next phase.
