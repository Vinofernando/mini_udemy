import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendVerificationEmail = async (toEmail, token) => {
    const link = `${process.env.APP_URL || 'http://localhost:5000'}/auth/verify/${token}`
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Verifikasi email anda",
        html: `<p>Klik link berikut untuk verifikasi akun:</p><a href=${link}>${link}</a>`
    })
}

export const sendResetPasswordEmail = async (toEmail, resetLink) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Reset Password",
        html: `<p>Klink link berikut untuk reset password:</p><a href= "${resetLink}">${resetLink}</a>`
    })
}

export const sendSuccessResetPassword = async (toEmail) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Reset password berhasil",
        html: "<p>Berhasil mereset password</p>"
    })
}