import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/ui/page-hero";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <PageHero 
        title="Privacy Policy"
        description="Learn about how we collect, use, and protect your information"
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h2>Privacy Policy</h2>
          <p>Last updated: January 1, 2023</p>
          
          <h3>1. Introduction</h3>
          <p>
            Welcome to IndianMacro ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website indianmacro.com, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site").
          </p>
          <p>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
          
          <h3>2. Information We Collect</h3>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          
          <h4>Personal Data</h4>
          <p>
            Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as subscribing to our newsletter or requesting information. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Site.
          </p>
          
          <h4>Derivative Data</h4>
          <p>
            Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </p>
          
          <h4>Financial Data</h4>
          <p>
            Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
          </p>
          
          <h4>Cookies and Web Beacons</h4>
          <p>
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
          </p>
          
          <h3>3. How We Use Your Information</h3>
          <p>
            We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
          </p>
          <ul>
            <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To allow us to better service you in responding to your customer service requests.</li>
            <li>To administer a contest, promotion, survey or other site feature.</li>
            <li>To quickly process your transactions.</li>
            <li>To ask for ratings and reviews of services or products.</li>
            <li>To follow up with them after correspondence (live chat, email or phone inquiries).</li>
          </ul>
          
          <h3>4. Disclosure of Your Information</h3>
          <p>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          
          <h4>By Law or to Protect Rights</h4>
          <p>
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </p>
          
          <h4>Third-Party Service Providers</h4>
          <p>
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </p>
          
          <h4>Marketing Communications</h4>
          <p>
            With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
          </p>
          
          <h4>Interactions with Other Users</h4>
          <p>
            If you interact with other users of the Site, those users may see your name, profile photo, and descriptions of your activity.
          </p>
          
          <h4>Online Postings</h4>
          <p>
            When you post comments, contributions or other content to the Site, your posts may be viewed by all users and may be publicly distributed outside the Site in perpetuity.
          </p>
          
          <h3>5. Security of Your Information</h3>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          
          <h3>6. Policy for Children</h3>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
          </p>
          
          <h3>7. Contact Us</h3>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p>
            IndianMacro<br />
            Email: privacy@indianmacro.com
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
