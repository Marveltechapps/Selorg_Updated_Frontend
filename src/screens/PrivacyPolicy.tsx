import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { GeneralInfoStackNavigationProp } from '../types/navigation';
import Header from '../components/layout/Header';
import { logger } from '@/utils/logger';

// Dummy static data - Replace with API call later
const DUMMY_PRIVACY_CONTENT = `Effective Date: [Insert Date]
Last Updated: [Insert Date]

The web-based platform "selorg.com" the mobile application "Selorg" and the brand Selorg are all owned by Selorg Tech Private Limited ("Selorg"), a company established under the Companies Act of 2013 and having its registered office at 1st Floor, No.63, Lattice Bridge Road, Adyar, Chennai - 600020.  The company is also authorized to operate and manage the platform under the Selorg name.

This privacy policy (Privacy Policy) explains the personal information we gather from you via our stores, other locations, websites, mobile applications, or other means. The terms "We," "Us," or "Our" apply to either the company, Selorg, or both, as the context requires, and the terms "You," "Your," "Yourself," or "User" refer to Platform users. It also outlines your rights and choices regarding your personal information and how to contact us with privacy-related concerns. We value your trust and prioritize the security of your data.

This refers to the applicable laws currently in force regarding data processing, including the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011, as amended or replaced over time.

Please read this Privacy Policy carefully before using our products or services. By using them, you consent to the collection and processing of your data as described. Our products and services are intended for users in India and comply with Indian laws. If accessing from outside India, you are responsible for understanding the local legal implications. By using the app, you agree to these terms. If you disagree, please do not use the app.

If there are any significant changes, we will give reasonable notice, such as a prominent announcement on the platform or through other communication channels. We may update this Privacy Policy to comply with administrative or regulatory requirements.

1. Information We Collect
1.1 Personal Information
You may provide us with personal details such as your name, phone number, email, date of birth, address, and government-issued ID (e.g., PAN, passport, driver's license). Providing this information is voluntary, and we will handle it in compliance with applicable laws and this Privacy Policy.
1.2 Non-Personal Information
We collect non-personal data like IP addresses, device details, browser information, and cookies. This data helps us analyze trends, improve services, and deliver relevant content. Although you have the option to reject cookies in your browser's settings, some features might not function properly.
1.3 Sensitive Personal Data
Sensitive data includes information like passwords, financial details, health records, and biometric data, which we may collect as part of our services.
1.4 Transactional Information
We gather transaction-related information when you use our services, such as payment information and order history, and store it safely on our servers or in storage systems owned by third parties.
1.5 Location-Based Information
If you use our platform on mobile or other devices, we may collect location data to provide location-based services. You can disable location tracking at any time, though some features may be affected.
1.6 Text-Based Information
If you interact on our message boards or send us correspondence, we collect and store your messages to resolve issues and improve our services.
1.7 Automatically Collected Information
We use cookies, pixels, and similar technologies to gather data automatically when you interact with our platform or third-party websites. This information is subject to the privacy policies of those third-party websites.

2. How We Use Your Information
Your information is used for the following purposes by us:
a) To provide and enhance the services you request on the platform.
b) For internal operations, such as warehousing, delivery, IT support, and data analysis.
c) To manage our services, settle disputes, and fix technical problems.
d) To ensure the security and integrity of the platform, services, and user experience.
e) To improve products, services, and customer relationship management processes.
f) To process payments related to the services.
g) To inform you of online and offline promotions, products, services, and updates.
h) To personalize your platform experience and share relevant marketing materials.
i) To detect, prevent, and address errors, fraud, and other prohibited activities.
j) To enforce and communicate our terms and conditions.
k) To address your comments or questions and provide the services you have requested.
l) To contact you regarding services via email, WhatsApp, SMS, phone, or other channels.
m) To enable you to receive personalized messages from our partners and service providers.
n) To notify you about important updates, policy changes, and other relevant notices.
o) To fulfill regulatory reporting requirements and legal requirements.
p) To carry out our obligations and enforce rights under any contract with you.
q) Working with appropriate partners to carry out research.
r) Any additional use for which you gave permission at the time the data was collected.
Additionally, we may occasionally ask you to complete optional surveys to gather demographic and contact information, helping us personalize your experience and offer relevant content. You can opt out of receiving promotional emails, though you will still receive administrative or transactional communications. We will not share your personal information with other users without your explicit consent.

4. Data Security
● As required by law, the Platform uses appropriate security measures to protect your privacy and personal data from being lost, misused, accessed by unauthorized parties, disclosed, destroyed, or altered. Secure servers are used whenever you access or modify your account information. However, it is your responsibility to implement adequate physical, managerial, and technical safeguards to protect your data, including personal information, while using the Platform.
● The confidentiality of your account information and all activities carried out using your account are entirely your responsibility. You promise to: a) Report any unauthorized use or access to your account, as well as any security breach, to us right away.
b) Log out of your account at the end of each session.
● We are not liable for any losses or damages resulting from your failure to comply with these responsibilities. You may also be held accountable for losses incurred by us or other users due to unauthorized access caused by your negligence in safeguarding your account credentials.
● Payment-related information transmitted through the Platform is encrypted. However, we cannot guarantee that such transmissions or personal information will always remain secure or that our security measures and those of third-party providers cannot be bypassed. We disclaim responsibility for information disclosures resulting from transmission errors, unauthorized access by third parties, or other factors beyond our control.
● Although we have taken reasonable precautions to protect your privacy while using the Platform, we cannot be held responsible for a) security lapses on third-party websites or applications or any actions taken by third parties that receive your personal information or b) loss, damage, or misuse of your personal information due to circumstances outside of our control ("force majeure events"), such as fires, natural disasters, wars, strikes, pandemics, regulatory restrictions, third-party hosting failures, or hardware or software flaws in your device.

5. Your Rights
We retain your personal information only for as long as it is necessary for the stated purposes or as required by applicable law. If you request us to delete your information—for instance, to access, edit, or remove your data on our website or mobile application—we will comply with your request. However, certain information may be retained for purposes permitted under this Privacy Policy unless otherwise prohibited by law.

Please note that if you choose not to provide the requested data, you may be unable to access certain products, programs, services, or our physical locations.

6. Third-Party Links
The Platform may provide links to third-party platforms ("Third-Party Sites") that may collect your personal information, including your IP address, browser details, or operating system information. We are not responsible for the security, privacy practices, or content of these third-party sites. Additionally, certain pages on these third-party sites may use "cookies" or similar technologies, which are beyond our control. These third-party sites and service providers may have their own privacy policies regarding the collection, storage, and use of your information.

This Privacy Policy does not apply to any information you provide to, or is collected by, these third-party sites. We recommend reviewing the privacy policies of such third-party sites to understand how they handle your information.

Additionally, we may show advertisements from outside advertising companies when you visit the platform. These businesses may use information about your visits to the Platform and third-party websites to show ads that are relevant to your interests rather than your name, address, email address, or phone number. You understand and accept that we have no control over content found on other websites or in search engine results.

Public Posts
Any content or personal information shared or uploaded in publicly accessible areas of the Platform, such as discussion boards, chat sections, or messages, will be publicly visible and accessible to other users. You may post reviews, comments, testimonials, or other content on the Platform (collectively, "Posts") about your use of the Services.

We will be the sole owner of all intellectual property rights to such posts. Your posts must comply with the conditions outlined in the terms. We reserve the right to remove or delete any post, or part of a post, that we believe violates these terms or if required by applicable law.

Your posts may be used, copied, or shared for any reason. Even if you delete your posts from the Platform, copies may remain accessible in archived pages or have been copied or stored by other users.

7. Children's Privacy
If you are under 18, you (i) verify that you are using the Platform under the supervision and consent of a parent or legal guardian who is legally able to enter into a legally binding contract on your behalf under the Indian Contract Act, 1872, and that they have accepted this Privacy Policy; and (ii) confirm that you are using the Platform and its services with your parent or legal guardian's express consent and supervision.

8. Your Acknowledgement
All information shared by you will be considered as willingly disclosed and free from any coercion. We shall not be held liable for the authenticity, genuineness, misrepresentation, fraud, or negligence related to the information you provide. Additionally, we are not responsible for verifying the accuracy of the information you disclose.

9. Withdrawal of Consent
You may withdraw your consent at any time by navigating to Home Page -> Settings Icon -> Profile on the mobile application.
If you choose not to provide consent or later withdraw it, we request that you refrain from accessing the platform or content or using the services. We also reserve the right to discontinue providing you with services, content, or features of the Platform upon your withdrawal of consent. In such cases, we will either delete your personal or other information or anonymize it to ensure it is no longer attributable to you. If we retain any personal information following the withdrawal or cancellation of consent, it will only be retained for the period permitted under applicable laws.
Please note that any personal information shared on third-party websites may remain available, as we do not have control over such platforms. Additionally, personal information you have shared with others or that has been copied by other users may still be visible. Your personal information may also appear in online searches. Therefore, we recommend sharing personal information only with trusted individuals, as they may save or reshare it, including syncing it to other devices.

10. Rectification of Your Information
You may review, correct, update, or change the information you have provided at any time by accessing Home Page -> Settings Icon -> Profile on the mobile application.
We may, however, be unable to grant access to the Platform or services if you update or modify your personal information in a way that is inaccurate or unverifiable. To ensure ongoing access to the Platform and services, we maintain the right to authenticate and validate your identity and the data you have submitted.
We will do our best to keep accurate and current records, but this depends on the accuracy of the information you give us. If your personal information violates someone else's rights or is prohibited by applicable laws, access, correction, updating, or deletion may be restricted or denied. It is your responsibility to promptly notify us of any changes to your personal information.

11. Changes to Our Privacy Policy
We reserve the right to modify, update, add, or remove portions of this Privacy Policy at any time and will notify you of such changes. All modifications will be effective as soon as they are published.
We encourage you to regularly review this Privacy Policy for updates. You can track changes by referring to the "Last Updated" date provided. By continuing to access the Platform or use the Services after any modifications, you confirm your acceptance of the revised Privacy Policy and agree to be legally bound by its terms.

12. Contact Us
If you have any questions regarding this Privacy Policy, please feel free to contact us at legal@selorg.com. We will make reasonable efforts to respond promptly to your requests, questions, or concerns about our use of your personal information. Please note that, unless required by law, we may not be able to respond to queries unrelated to this Privacy Policy or our privacy practices.`;

const PrivacyPolicy: React.FC = () => {
  const navigation = useNavigation<GeneralInfoStackNavigationProp>();
  // State for API integration (ready for future use)
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Placeholder for API call - Replace with actual API later
  useEffect(() => {
    const fetchPrivacyContent = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/privacy-policy');
        // const data = await response.json();
        // setContent(data.content);

        // Using dummy data for now
        setContent(DUMMY_PRIVACY_CONTENT);
      } catch (error) {
        logger.error('Error fetching privacy content', error);
        // Fallback to dummy data
        setContent(DUMMY_PRIVACY_CONTENT);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyContent();
  }, []);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header title="Privacy Policy" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <Text style={styles.contentText}>{content}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  contentText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
    textAlign: 'left',
  },
  loadingText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default PrivacyPolicy;

