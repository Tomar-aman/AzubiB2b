import { Container, Typography } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body2" paragraph>
        This Privacy Policy describes how we collects, uses, and protects your
        information when you use our website, mobile application, and related
        services.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Information We Collect
      </Typography>
      <Typography variant="body2" paragraph>
        We may collect personal and non-personal information including but not
        limited to your name, email address, phone number, company details,
        login credentials, IP address, device information, and usage data when
        you interact with our Services.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body2" paragraph>
        The information we collect is used to:
        <br />• Provide and maintain our Services
        <br />• Improve user experience and platform functionality
        <br />• Communicate important updates and support messages
        <br />• Ensure security, prevent fraud, and comply with legal obligations
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Data Sharing and Disclosure
      </Typography>
      <Typography variant="body2" paragraph>
        We do not sell or rent your personal information. Your data may be
        shared only with trusted third-party service providers who assist us in
        operating our Services, subject to strict confidentiality obligations,
        or when required by law.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Data Security
      </Typography>
      <Typography variant="body2" paragraph>
        We implement appropriate technical and organizational security measures
        to protect your information against unauthorized access, alteration,
        disclosure, or destruction. However, no method of transmission over the
        internet is 100% secure.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. User Rights
      </Typography>
      <Typography variant="body2" paragraph>
        You have the right to access, update, or request deletion of your
        personal information, subject to applicable laws. Requests can be made
        by contacting us using the details below.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Changes to This Policy
      </Typography>
      <Typography variant="body2" paragraph>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page, and continued use of our Services indicates your
        acceptance of the updated policy.
      </Typography>

      {/* <Typography variant="h6" gutterBottom>
        7. Contact Us
      </Typography>
      <Typography variant="body2">
        If you have any questions about this Privacy Policy or our data
        practices, please contact us at:
        <br />
        <strong>Email:</strong> support@yourcompany.com
      </Typography> */}
    </Container>
  );
};

export default PrivacyPolicy;
