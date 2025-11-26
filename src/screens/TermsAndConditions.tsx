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
const DUMMY_TERMS_CONTENT = `1. Introduction
This record is created in accordance with the Information Technology Act, 2000, and its applicable rules
A. The website www.selorg.com ("Website") and the mobile application 'Selorg' ("App") (together referred to as the "Platform") are managed and operated by the Company "Selorg Tech Private Limited". The term "Company" collectively refers to any entity responsible for the operation and management of the Platform for retail purposes.
B. Your use of the Platform is governed by these terms of use ("Terms"). Other names for the Company include "Selorg," "We," "Us," or "Our," whereas "You," "Your," or "User" indicate the person using the Platform.
C. Before utilizing the Platform, please read these Terms carefully. You should remove the app and stop using the platform if you disagree with these terms. You agree to these Terms and any other Selorg policies (such as the cancellation and refund policy or the privacy policy), as modified from time to time, by accessing or using the Platform. This agreement creates a binding legal relationship between you and Selorg and takes effect on the day you access or use the Platform. By providing personal information, you consent to Selorg using it to provide services in accordance with these Terms.
D. Selorg reserves the right to modify or update these Terms at its sole discretion. The "Last Updated" section on the Platform indicates the latest version of these Terms. You are encouraged to regularly review the Terms. Continued use of the Platform after modifications signifies your acceptance of the changes. If you disagree with any updates, you must cease using the Platform. We take appropriate precautions to protect your transactions and personal data since we are dedicated to earning your trust.

2. Products and Services
1. Platform Access and Offerings:
○ The Platform allows you to access:
i. A restricted, individual, non-exclusive, non-transferable, and revocable license to use the Platform to buy products such as fruits, vegetables, and groceries for one's own use only—not for the purpose of reselling.
ii. Assistance with queries or issues related to your account and orders placed through the Platform.
iii. Selorg does not independently provide services such as product handling, last-mile delivery, or related support without the purchase of products through the platform. Additional fees may apply for such services.
2. Restrictions and Discretion:
○ The privilege to access the Platform excludes commercial use or resale of its Content (defined below).
○ The company may modify or remove products or services at its discretion without prior notice. Additional terms may apply to certain categories of products, and such purchases will be governed by those terms alongside these terms.
3. Availability of Products and Services:
○ Selorg determines the areas or cities in India where its services are available. Users must verify availability in their region before placing orders. Deliveries may be facilitated directly or via third-party providers.
4. Commitments of the Company:
○ Selorg does not engage in unfair trade practices, discrimination among users, or preferential treatment of third-party delivery services.

3. User Acceptance and Obligations
1. Usage Rights:
○ By agreeing to these Terms, you are granted a personal, limited, non-exclusive, non-transferable, and revocable right to access and use the Platform solely for purposes that:
 a. Comply with these Terms;
 b. Adhere to applicable laws and guidelines; and
 c. Relate to the services and products offered through the Platform.
2. Prohibited Activities:
○ You agree not to:
 a. Reproduce, duplicate, copy, sell, or resell any part of the Platform for commercial purposes.
 b. Frame or use framing techniques to enclose trademarks, logos, or proprietary information without permission.
 c. Use unauthorized tools (e.g., bots, spiders) to monitor or extract data from the Platform.
3. Content Restrictions:
○ You are prohibited from uploading, sharing, or transmitting content that:
 a. Belongs to others without proper authorization.
 b. Is defamatory, obscene, invasive of privacy, or otherwise harmful.
 c. Exploits or harms minors.
 d. Infringes on intellectual property rights.
 e. Attempts to reverse engineer or exploit the Platform's software or data.
 f. Violates laws or promotes criminal activity.
 g. Misrepresents your identity or impersonates others.
 h. Contains harmful code, such as viruses or malware.
4. Security and Responsibility:
○ You are responsible for maintaining the devices, software, and internet connection required to access the Platform.
○ Any offensive or objectionable content encountered on the Platform is accessed at your own risk. Selorg disclaims liability for such content to the fullest extent permitted by law.

4. User Account & Registration Obligation
1. To access the supplies on the Platform, you must register and create an account by providing the necessary details as outlined in the Privacy Policy ("Account").
2. You are solely responsible for the information you provide. It is your responsibility to ensure that your account information is complete, accurate, and up-to-date. If there are any changes to your Account information or if any information is incomplete or incorrect, you must promptly update your Account details on the Platform or request Selorg to update it. False, inaccurate, unauthorized, outdated, or incomplete information may result in refusal of supplies or denial of access to the Platform without notice. You are responsible for maintaining the confidentiality of your account credentials and are fully accountable for all activities conducted under your Account. Any unauthorized use must be immediately reported to Selorg. Failure to maintain account confidentiality may lead to damages for which you could be held liable.

5. User Eligibility
1. Supplies are not available to:
 a. Minors (persons under 18 years of age);
 b. Undischarged insolvents; or
 c. Individuals who are not legally competent under the Indian Contract Act, 1872.
By using the Platform, you represent and warrant that you are:
 i. Of legal age to form a binding contract;
 ii. Not barred from receiving supplies under applicable laws; and
 iii. Competent to enter into a binding contract.
If you are under 18, you may use the Platform only with the express consent of a parent or guardian and under their supervision.
2. Discrimination against third-party delivery service providers on the basis of race, religion, caste, creed, national origin, disability, sexual orientation, sex, marital status, gender identity, or age is strictly prohibited. Evidence of such behavior may result in the suspension of your account and access to the Platform without liability or recourse.

6. Product Pricing Information
1. Ownership of products transfers to you upon delivery to the address specified during the order process.
2. Prices for products may vary due to multiple factors. You should review pricing before placing an order. Products are sold in Indian Rupees, either at Maximum Retail Price (MRP) (inclusive of taxes) or at a discounted price. Errors in pricing or product information should be reported for correction.
3. During the checkout process, all charges, including delivery fees, will be disclosed. The company does not manipulate product prices.

7. Delivery Terms and Charges
1. Last-mile delivery charges may apply. Estimated delivery times are communicated on the Platform but are not guaranteed due to factors such as demand, traffic, weather, or force majeure events. The estimated time of arrival (ETA) is displayed on the app homepage before order placement. Additional fees (e.g., packing, peak hour, or late-night fees) will be visible at checkout.
2. It is your responsibility to provide an accurate and complete delivery address. The company is not liable for delays caused by incorrect addresses.
3. Products will be delivered to an appropriate person at the specified address. If you request unattended delivery, the company is not responsible for theft, tampering, or contamination.
4. If you choose Cash on Delivery (CoD) and fail to make payment upon delivery, the company may refuse delivery, cancel the order, and retain any attempted delivery fees.

8. Returns, Cancellations, and Refunds
1. Conditions for Returns:
○ Wrong items delivered.
○ Damaged or deteriorated items (with proof such as images).
○ Returns/exchanges are only accepted if the product is sealed, unopened, and in original condition.
2. Requests must be made on the same day as delivery.
3. User Cancellations:
○ Orders cannot be canceled after acceptance by the company.
4. Company Cancellations:
○ Orders may be canceled due to unavailability or force majeure.
5. Refunds:
○ Refunds are processed within 7 business days after verification and credited to the original payment source.
6. Additional Conditions:
○ The company may impose additional terms for returns, cancellations, or refunds, which will be communicated via push notifications or other means.

9. Billing and Payment Information
1. The Platform will display the accepted payment methods during the purchase process.
2. Subject to applicable laws and the Privacy Policy, you agree that the Company may use third-party vendors and service providers, including payment gateways, to process payments and manage payment information. The Company ensures that such third-party vendors and service providers possess the required licenses from relevant authorities.
3. To use the services, you must provide valid bank details or other necessary information to facilitate payment ("Payment Details"). By submitting your Payment Details, you confirm that: (a) You are legally authorized to provide such Payment Details; (b) You are legally authorized to make payments using these Payment Details; and (c) Your actions comply with applicable laws and the terms governing the use of such Payment Details. You may add, update, or delete Payment Details on the Platform at any time.
4. Except as required by law, the Company is not responsible for payments authorized through the Platform using your Payment Details. The Company is not liable for incomplete payments resulting from: (a) Insufficient funds in your account or payment method; (b) Incorrect Payment Details provided; (c) Expired payment methods; or (d) External factors, such as power outages or internet interruptions, that prevent the transaction from being completed.
5. The Company is not liable for unauthorized transactions conducted on the Platform using your Payment Details and is under no obligation to refund such transactions.
6. The Company's payment services are electronic, automated systems utilizing authorized banking infrastructure and card payment gateways. For certain payment methods, additional charges or fees may apply, as determined by your payment provider.
7. Ownership of products purchased on the Platform transfers to you upon successful payment and fulfillment of any order requirements.

10. Promotional Content
1. The Platform may display advertisements from third-party advertisers ("Third-Party Advertisers"). The Company does not review, endorse, or take responsibility for the content provided by Third-Party Advertisers to the extent allowed by law.
2. If you are a Third-Party Advertiser, you must comply with the Company's policies and other contractual requirements for placing advertisements. Advertisements should not be misleading or violate applicable laws or guidelines issued by regulatory bodies. The Company reserves the right to remove advertisements or request substantiating evidence if they believe the content is misleading or unlawful.
3. If you find any third-party advertisement inappropriate or in violation of applicable laws, please contact the Company at the provided email address.

11. Customer Care
1. Warranty and Guarantee
● Manufacturer Responsibility: Warranties and guarantees for products are provided solely by the manufacturers.
● Customer Support: Contact the manufacturer directly using the details provided on product packaging for any warranty or guarantee-related issues.
● Disclaimer: The Company acts as a reseller and is not liable for manufacturing defects, quality issues, or performance concerns.
2. Product Information
● Images: Product images on the Platform are for reference only and may differ from the actual product.
● Labels: Verify details such as nutritional values, usage instructions, manufacture date, and batch information from the product label before use.
● Accuracy Disclaimer: While the Company strives to provide accurate information, discrepancies may exist. Refer to the product packaging for precise details.
3. Transaction Monitoring
● Right to Refuse: The company reserves the right to reject or delay transactions if there are concerns about user credibility or order authenticity.
● Checks: Security checks may be conducted, and suspicious orders may be delayed or canceled.
4. Fraud Awareness
● Sensitive Information: The company will never request sensitive information such as card numbers, CVVs, OTPs, or UPI PINs.
● Reporting Fraud: Immediately report suspicious activity to your bank, local authorities, or cybercrime.gov.in.
● Verification: Be cautious of fake websites or payment links. Avoid sharing personal or financial information with unauthorized sources.

12. Resolution of Grievances
1. Grievance Handling
a. For order-related issues, you may write to support@selorg.com. The company aims to resolve grievances within the timelines prescribed by applicable laws. If you remain dissatisfied, you can escalate your concerns to the designated grievance officer. Details of the officer are available on the Platform in compliance with the Information Technology Act, 2000, and Consumer Protection (E-Commerce) Rules, 2020.
2. Response Timelines
● The Grievance Officer will acknowledge your complaint within 48 hours and resolve it within 30 days of receipt. You agree to cooperate fully by providing any requested information during the grievance resolution process.

13. General Terms
1. Notices
All official communications will be sent via email to your registered address, through messaging apps linked to your registered phone number, or as general notifications on the Platform.
2. Assignment
You may not transfer your rights or obligations under these Terms to a third party. The Company reserves the right to assign its rights and obligations to any successor or third party without requiring your consent.
3. Severability
If any provision of these Terms is deemed unenforceable, the remaining provisions will continue in full effect to reflect the original intent as closely as possible.
4. Force Majeure
The company is not liable for delays or failures to fulfill obligations due to causes beyond its control, including natural disasters, wars, strikes, pandemics, regulatory restrictions, or third-party service disruptions.

14. Intellectual Property Rights and Ownership
1. The platform, including its processes, content, and arrangement—such as text, videos, graphics, user interfaces, visual designs, sound elements, artwork, and computer code (collectively referred to as "Content")—is owned or licensed by the Company. The design, structure, layout, coordination, appearance, and arrangement of the content are protected under copyright, trademark, patent, and other relevant intellectual property laws.
2. The trademarks, logos, and service marks displayed on the platform ("Marks") are owned by the Company or licensed from third parties. You are not permitted to use these Marks without prior written consent from the Company or the respective third-party owner. Accessing or using the platform does not grant you any rights to use these trademarks, logos, or other proprietary materials in any way.
3. The company does not claim ownership or any rights, titles, or interests in the intellectual property associated with the products offered on the platform.
4. References to names, trademarks, services, or products of third parties on the platform are provided solely for user convenience with their express consent. These references do not imply any endorsement, sponsorship, or recommendation by the company.

15. Intellectual Property Rights Infringement
1. If you believe that the platform infringes upon your intellectual property rights, you must promptly notify the company in writing at legal@selorg.com. Such notifications should only be submitted by the intellectual property owner or an authorized agent. False claims may result in termination of your access to the platform.
2. Your notice should include the following details:
○ Proof of ownership of the intellectual property you believe is being infringed.
○ Identification of the material you believe is infringing, including sufficient information about its location on the platform.
○ A statement that you have a good-faith belief that the identified material is unauthorized by the intellectual property owner, its agent, or the law.
○ Your contact information, such as address, phone number, and email.
○ A statement under penalty of perjury that the information provided is accurate and that you are the intellectual property owner or authorized to act on behalf of the owner.
○ Your physical or electronic signature.
3. Incomplete requests will not be considered by the company.

16. Violations of Terms
1. You acknowledge that any violation of these Terms may cause irreparable harm to the Company, for which monetary damages may not suffice. Therefore, the company is entitled to seek injunctive or equitable relief in addition to other legal remedies available under applicable laws.

17. Account Suspension and Termination
1. These terms remain in effect until terminated by either you or the company. If you disagree with the terms or are dissatisfied with the platform, you may deactivate your account and/or discontinue using the platform.
2. The company reserves the right to suspend, terminate, or restrict your access to the platform or your account at its sole discretion if you violate these terms, the privacy policy, or act in an unethical manner. Certain provisions of these Terms, intended to survive termination, will remain effective indefinitely unless explicitly terminated by the Company.
3. Termination under this section does not absolve you of your obligations, including payment for any supplies purchased before the termination date.
4. You remain responsible for paying any applicable fees or charges for supplies up to the date of termination, regardless of which party initiated it.

18. Limitation of Warranties and Liability
1. To the fullest extent permitted by law:
○ The platform and its content are provided on an "as is" basis without any warranties, whether express or implied, including but not limited to warranties of title, non-infringement, merchantability, or fitness for a particular purpose. The company does not guarantee uninterrupted, timely, secure, or error-free access to the platform.
○ The company is not responsible for any unauthorized use of your account or account information on the platform.
○ While efforts are made to ensure the accuracy of the information on the platform, the company does not guarantee the completeness or reliability of any data. It is not liable for delays, interruptions, or failures in accessing or using the platform due to technical issues or factors beyond its control.
2. Product images and colors displayed on the platform are for representation purposes only. Actual colors may vary based on device settings, and the company does not guarantee accuracy in such cases.
3. The platform's content may not be appropriate or accessible outside India. Users accessing the platform from other jurisdictions do so at their own risk and are responsible for compliance with local laws.
4. These Terms do not authorize or endorse promotional activities or solicitations in jurisdictions where they are not permitted.

19. Indemnification and Limitation of Liability
1. You agree to indemnify and hold harmless the company, its affiliates, officers, directors, employees, and partners from any losses, liabilities, claims, damages, or expenses arising from:
○ Breach of your obligations under these Terms or the Privacy Policy.
○ Claims by third parties arising from your use of the platform.
○ Misrepresentation of any data or information provided by you.
○ Violations of applicable laws or third-party rights, including intellectual property rights.
2. The company and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
3. The limitations and exclusions outlined in this section apply to the fullest extent permitted by law.

20. Governing Law and Jurisdiction
This User Agreement shall be governed by the laws of India. Any disputes arising from this agreement shall fall under the exclusive jurisdiction of the courts in Chennai. The arbitration shall take place in Chennai, and the High Court of Chennai shall have exclusive jurisdiction. Indian law shall apply to all matters related to this agreement.`;

const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation<GeneralInfoStackNavigationProp>();
  // State for API integration (ready for future use)
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Placeholder for API call - Replace with actual API later
  useEffect(() => {
    const fetchTermsContent = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/terms-and-conditions');
        // const data = await response.json();
        // setContent(data.content);

        // Using dummy data for now
        setContent(DUMMY_TERMS_CONTENT);
      } catch (error) {
        logger.error('Error fetching terms content', error);
        // Fallback to dummy data
        setContent(DUMMY_TERMS_CONTENT);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsContent();
  }, []);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header title="Terms & Conditions" />
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

export default TermsAndConditions;

