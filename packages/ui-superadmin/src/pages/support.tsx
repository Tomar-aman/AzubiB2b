import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    List,
    ListItem,
    ListItemText,
    Divider,
    Link,
} from "@mui/material";

const Support: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                px: { xs: 2, md: 8 },
                py: 6,
                bgcolor: "background.default",
            }}
        >
            {/* Header */}
            <Box textAlign="center" mb={5}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Support & Help
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth={700} mx="auto">
                    Welcome to the Company Job APP Support Center. If you need assistance with your account,
                    job postings, or technical issues, we’re here to help.
                </Typography>
            </Box>

            {/* Contact Support */}
            <Box maxWidth="md" mx="auto" mb={5}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            {/* <EmailIcon color="primary" /> */}
                            <Typography variant="h6">Contact Support</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            For all support requests, please contact us via email:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            📧{' '}
                            <Link href="mailto:saarcard@me.com" underline="hover">
                                saarcard@me.com
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* What we can help you with */}
            <Box maxWidth="md" mx="auto" mb={5}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                            {/* <HelpOutlineIcon color="primary" /> */}
                            <Typography variant="h6">What we can help you with</Typography>
                        </Stack>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Company account & login issues" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Creating, editing, or managing job postings" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Applications and candidate messages" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Job alerts and visibility" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Technical or system-related problems" />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>

            {/* Before you contact us */}
            <Box maxWidth="md" mx="auto">
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" mb={2}>
                            Before you contact us
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            To help us assist you faster, please include:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Your company name" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="A short description of the issue" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Screenshots (if available)" />
                            </ListItem>
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Our support team will review your request and respond as quickly as possible.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Support;
