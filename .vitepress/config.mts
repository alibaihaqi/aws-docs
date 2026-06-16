import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/aws-docs/',
  cleanUrls: true,
  lang: 'en-US',
  lastUpdated: true,
  srcDir: 'src',

  locales: {
    root: {
      label: 'English',
      lang: 'en'
    }
  },

  title: 'AWS Documentation',
  description: 'AWS Documentation Collection',

  head: [
    ['link', { rel: 'icon', href: 'https://www.alibaihaqi.com/favicon.ico' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Introduction', link: '/introduction/' },
      { text: 'Beginner', link: '/beginner/' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      copyright: 'Copyright © 2026 - Present by Fadli Al Baihaqi'
    },

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Getting Started', link: '/introduction/getting-started' }
        ]
      },
      {
        text: 'Beginner',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/beginner/' },
          { text: '01 What we\'ll build', link: '/beginner/01-what-well-build' },
          { text: '02 IAM in plain language', link: '/beginner/02-iam-basics' },
          { text: '03 Create an admin IAM user', link: '/beginner/03-create-iam-user' },
          { text: '04 Configure the AWS CLI', link: '/beginner/04-configure-cli' },
          { text: '05 S3 in plain language', link: '/beginner/05-s3-basics' },
          { text: '06 Create your first S3 bucket', link: '/beginner/06-create-bucket' },
          { text: '07 Write index.html locally', link: '/beginner/07-write-html' },
          { text: '08 Upload index.html to S3', link: '/beginner/08-upload-to-s3' },
          { text: '09 Make the bucket publicly readable', link: '/beginner/09-public-bucket' },
          { text: '10 CloudFront in plain language', link: '/beginner/10-cloudfront-basics' },
          { text: '11 Create a CloudFront distribution', link: '/beginner/11-create-distribution' },
          { text: '12 Wait for deploy', link: '/beginner/12-wait-for-deploy' },
          { text: '13 Verify the public URL', link: '/beginner/13-verify-and-finish' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/alibaihaqi' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/alibaihaqi/' }
    ]
  }
})
