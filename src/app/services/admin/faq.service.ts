import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  faqData = [
    {
      title:"How to change the website's color scheme?",
      text:["In the 'Color Schema' tab, you can modify the color scheme visible to regular users."],
      tags:['design', "color sheme", "appearance"]
    },
    {
      title:"How to add a custom logo to the website?",
      text:["On any page with the builder, select the 'IMG' element, then choose the desired logo in the configurator."],
      tags:["constructor", "logo", "appearance"]
    },
    {
      title:"How to change fonts and text sizes on the website?",
      text:["You can add your own CSS in the 'Head' tab or on the page card. Additionally, each element has a modal window allowing you to modify commonly used CSS styles."],
      tags:["css", "font", "text", "design"]
    },
    {
      title:"How to add custom CSS styles to the website?",
      text:["You can add your own CSS in the 'Head' tab or on the page card."],
      tags:["functions", "css", "cms", "page"]
    },
    {
      title:"How to check the mobile responsiveness of the website?",
      text:["To check responsiveness, browser extensions are available. For example, Google Chrome has the Mobile Simulator extension."],
      tags:["cms", "mobile", "appearance"]
    },
    {
      title:"How to add content to a page?",
      text:["To add or edit content on a page, you can use the convenient builder. Simply navigate to the page you want to edit and click the 'Update Content' button. You'll be taken to the page builder."],
      tags:["basic", "cms"]
    },
    {
      title:"How to create custom templates and themes for a website using our CMS?",
      text:["Our CMS provides tools for creating custom templates or themes. You can edit existing templates or create new ones to tailor the look of your site to suit your needs."],
      tags:["basic", "templates"]
    },
    {
      title:"What are the main functions of our CMS?",
      text:[
        "Creating and editing website pages;",
        "Site structure management;",
        "Adding and editing content (text, images, videos, etc.);"
      ],
      tags:["basic"]
    },
    {
      title:"What should I do if I have problems using our CMS?",
      text:["If you have any problems using our CMS, you can contact our support team. We provide various communication methods: email, telephone, online chat, etc."],
      tags:["support", "contacts"]
    },
    {
      title:"How can I contact your support team?",
      text:[
        "To contact our support team you can use the following methods:",
        "Email: Julia.Badanova@ivkhk.ee / Aleksei.Kozlov@ivkhk.ee;",
        "▸ Phone: +372 56478384"
      ],
      tags:["support", "contacts"]
    },
    {
      title:"How to add/change/delete elements on the site?",
      text:["you can change elements in the constructor or change data in the table that is connected to the template to reproduce it. for the second option, go to the 'Database' tab and change the data in the table there"],
      tags:["project", "cms", "content", "database"]
    },
    {
      title:"How to set up website traffic tracking?",
      text:["On the CMS dashboard homepage, you can view the basic characteristics of your website. For a more in-depth report, we recommend using third-party services like Google Analytics or other similar services."],
      tags:["poject", "traffic"]
    },
    {
      title:"How to create custom templates for a website using our CMS?",
      text:["For more autonomous work with our CMS, you can go to the 'Templates' tab and there you first create a template, then when you go to it you will see the familiar designer"],
      tags:["project", "cms", "templates", "constructor"]
    },
    {
      title:"How to upload an image to the website?",
      text:["To upload media content to the website, go to the 'Files' tab, then click the 'Upload File' button. Depending on the selected folder, you can upload different files."],
      tags:["cms","mediacontent","constructor"]
    },
    {
      title:"How to change a user's password?",
      text:["In the 'User' tab, you can change data such as passwords and public links, like Facebook and Instagram, and other details."],
      tags:["user"]
    },
    {
      title:"How to add a new administrator?",
      text:["Currently, the CMS is single-user. In future versions, we plan to add this feature."],
      tags:["user", "multi-user"]
    },
    {
      title:"How to add meta tags to a page?",
      text:["You can configure basic tags in the 'Head' tab. Additionally, you can set them individually for each page. Just go to the page card, where you'll find the same functionality as in the 'Head' tab."],
      tags:["seo", "cms"]
    },
    {
      title:"How to set a brief description (description) for a page?",
      text:["In the 'Head' tab, you can set the description for the entire site or create your own description for each page card."],
      tags:["seo", "cms"]
    },
    {
      title:"How to perform data backup in CMS?",
      text:["Currently, this is not provided for. You can use third-party services like S3 from AWS."],
      tags:["cms", "backup"]
    },
    {
      title:"How to update the CMS version?",
      text:["You can download the latest version from GitHub or use DockerLab."],
      tags:["cms", "update", "versions"]
    },
    {
      title:"How to add social sharing buttons to articles?",
      text:["Currently, you can select social buttons in the builder, such as Facebook, Instagram, GitHub, Google, and Itchio."],
      tags:["constructor", "social"]
    },
    {
      title:"How to add support for another language on the website?",
      text:["Currently, multilingual support is not available, but it is planned for future versions of the project."],
      tags:["cms", "future", "languages"]
    },
    {
      title:"How to protect the website from hacking?",
      text:["We recommend setting a strong password after creating and launching the CMS. Additionally, two-factor authentication will be added in future project developments."],
      tags:["cms", "security", "user"]
    },
    {
      title:"How to perform database backup?",
      text:["Often, hosting providers where you deploy the CMS offer services for database backup."],
      tags:["database", "backup"]
    }
  ]
}