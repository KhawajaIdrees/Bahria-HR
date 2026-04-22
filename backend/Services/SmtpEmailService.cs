using System.Net;
using System.Net.Mail;

namespace FacultyInduction.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string toEmail, string subject, string htmlBody)
        {
            var host = _configuration["Smtp:Host"];
            var portStr = _configuration["Smtp:Port"];
            var username = _configuration["Smtp:Username"];
            var password = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:FromEmail"];
            var fromName = _configuration["Smtp:FromName"] ?? "Faculty Induction System";
            var enableSslStr = _configuration["Smtp:EnableSsl"];

            if (string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(portStr) ||
                string.IsNullOrWhiteSpace(fromEmail))
            {
                throw new InvalidOperationException("SMTP is not configured. Please set Smtp settings in appsettings.json.");
            }

            if (!int.TryParse(portStr, out var port))
            {
                throw new InvalidOperationException("Invalid Smtp:Port value.");
            }

            var enableSsl = true;
            if (!string.IsNullOrWhiteSpace(enableSslStr))
            {
                bool.TryParse(enableSslStr, out enableSsl);
            }

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
            };

            if (!string.IsNullOrWhiteSpace(username))
            {
                client.Credentials = new NetworkCredential(username, password);
            }

            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            await client.SendMailAsync(message);
        }
    }
}
