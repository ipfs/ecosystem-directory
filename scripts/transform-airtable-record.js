// Strips http(s) to use // and let the client determine the protocol
const removeProtocol = (url) => {
  return url?.replace(/^https?:\/\//, '//')
}

// strip url of all protocol details and remove trailing slashes
const beautifyUrl = (url) => {
  return url?.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
// This function transforms the raw record data that was filled into the Airtable database into the format
// needed by the UI. A lot of the logic was copied from the Airtable utomation that would do this transformation
// and populate the record.json field.
// The target schema and return value of this should adhere to: https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/content/data/project-schema.json
// This is intended to replace and eliminate the Airtable transformation
exports.transformAirtableRecord = (record, { iconFileName, logoFileName }) => {
  const file = getProjectNameSlug(record['Product/project name'])

  const name = record['Product/project name']
  const org = record['Org/company name']
  const descShort = record['Short description']
  const descLong = record['Long description']
  const sortSince = record.Since
  const numOne = record['Big-number benefit 1']
  const numTwo = record['Big-number benefit 2']
  const numThree = record['Big-number benefit 3']
  const numOneValue = record['big-number-benefit-1-value']
  const numTwoValue = record['big-number-benefit-2-value']
  const numThreeValue = record['big-number-benefit-3-value']
  const ctaTitle = record['CTA card title']
  const ctaDesc = record['CTA card description']
  const ctaButton = record['CTA card button text']
  const featured = Boolean(record.featured)

  const linkWebsites = record.Website
  const linkRepos = record.Repo
  const video = record.Video
  const ctaLink = record['CTA card URL']

  const catIndustry = record['Industry']
    ?.replace(/browsers/gi, 'browsers')
    .replace(/content\sdelivery/gi, 'content-delivery')
    .replace(/data\s\&\smachine\slearning/gi, 'data-machine-learning')
    .replace(/data\sgovernance/gi, 'data-governance')
    .replace(/data\spersistence/gi, 'data-persistence')
    .replace(/defi/gi, 'defi')
    .replace(/games\s\&\sVR\/AR/gi, 'games-vr-ar')
    .replace(/identity/gi, 'identity')
    .replace(/integrations/gi, 'integrations')
    .replace(/iot/gi, 'iot')
    .replace(/marketplaces\s\&\secommerce/gi, 'marketplaces-ecommerce')
    .replace(/nfts/gi, 'nfts')
    .replace(/other/gi, 'other')
    .replace(/prediction/gi, 'prediction')
    .replace(/social\smedia/gi, 'social-media')

  const catFocusAreas = record['Focus areas']?.map((el) =>
    el
      .replace(/community\snetworks/gi, 'community-networks')
      .replace(/developer\stools/gi, 'dev-tools')
      .replace(/education/gi, 'education')
      .replace(/file\ssharing/gi, 'file-sharing')
      .replace(/glam/gi, 'glam')
      .replace(/infrastructure/gi, 'infrastructure')
      .replace(/medical\sdata/gi, 'medical')
      .replace(/mobile/gi, 'mobile')
      .replace(/music/gi, 'music')
      .replace(/package\smanagers/gi, 'package-managers')
      .replace(/public\sdata/gi, 'public-data')
      .replace(/reputation\s\&\sip\smanagement/gi, 'reputation-ip')
      .replace(/research\sdata/gi, 'research-data')
      .replace(/storage\s&\spinning/gi, 'storage-pinning')
      .replace(/streaming/gi, 'streaming')
      .replace(/supply\schain/gi, 'supply-chain')
      .replace(/video/gi, 'video')
      .replace(/web\shosting\s\&\spublishing/gi, 'web-hosting-publishing'),
  )

  var catBenefits = record['IPFS benefits']?.map((el) =>
    el
      .replace(
        /corporate\s\&\sgovernment\sindependence/gi,
        'corporate-government-independence',
      )
      .replace(
        /couldn\'t\sexist\swithout\sipfs/gi,
        'couldnt-exist-without-ipfs',
      )
      .replace(/data\sintegrity\sand\sverifiability/gi, 'data-integrity')
      .replace(/data\sintegrity/gi, 'data-integrity')
      .replace(/disaster\sresilience/gi, 'disaster-resilience')
      .replace(/interoperability/gi, 'interoperability')
      .replace(/local\-first\smodel/gi, 'local-first-model')
      .replace(/self\-sovereign\sdata/gi, 'self-sovereign-data'),
  )

  var catTooling = record['Tooling']?.map((el) =>
    el
      .replace(/kubo\s\(formerly\sgo-ipfs\)/gi, 'go-ipfs')
      .replace(/bitswap/gi, 'bitswap')
      .replace(/cljs\-ipfs/gi, 'cljs-ipfs')
      .replace(/ecosystem\stools/gi, 'ecosystem-tools')
      .replace(/filecoin/gi, 'filecoin')
      .replace(/go\-ipfs/gi, 'go-ipfs')
      .replace(/go\-libp2p/gi, 'go-libp2p')
      .replace(/http\sgateway/gi, 'http-gateway')
      .replace(/ipfs\scluster/gi, 'ipfs-cluster')
      .replace(/ipfs\-embed/gi, 'ipfs-embed')
      .replace(/ipld/gi, 'ipld')
      .replace(/js\-ipfs/gi, 'js-ipfs')
      .replace(/js\-ipfs\-https\-client/gi, 'js-ipfs-https-client')
      .replace(/js\-libp2p/gi, 'js-libp2p')
      .replace(/pinning\sservices/gi, 'pinning-services')
      .replace(/py\-ipfs\-http\-client/gi, 'py-ipfs-http-client')
      .replace(/rust\-libp2p/gi, 'rust-libp2p'),
  )

  const transformedProject = {
    name,
    file,
    display: true,
    featured,
    sortNumbers: {
      since: parseInt(sortSince),
    },
    logo: {
      // Duplicate image file across both fields, if only one exists
      icon: iconFileName ?? logoFileName,
      full: logoFileName ?? iconFileName,
    },
    org: [org],
    description: {
      short: descShort,
      long: descLong,
    },
    primaryCta: {
      url: removeProtocol(linkWebsites),
      text: 'Project Website',
    },
    links: [
      {
        label: 'Website',
        links: [
          {
            url: removeProtocol(linkWebsites),
            text: beautifyUrl(linkWebsites),
          },
        ],
      },
      {
        label: 'Repo',
        links: [
          {
            url: removeProtocol(linkRepos),
            text: beautifyUrl(linkRepos),
          },
        ],
      },
    ],
    keyInfo: [
      {
        label: 'Using IPFS since',
        value: sortSince,
      },
    ],
    video: removeProtocol(video),
    stats: [
      {
        label: numOne ?? '',
        value: numOneValue ?? '',
      },
      {
        label: numTwo ?? '',
        value: numTwoValue ?? '',
      },
      {
        label: numThree ?? '',
        value: numThreeValue ?? '',
      },
    ],
    ctaCard: {
      title: ctaTitle,
      description: ctaDesc,
      buttonText: ctaButton,
      url: removeProtocol(ctaLink),
    },
    taxonomies: [
      {
        slug: 'industry',
        tags: [catIndustry ?? ''],
      },
      {
        slug: 'focus',
        tags: catFocusAreas ?? [''],
      },
      {
        slug: 'benefits',
        tags: catBenefits ?? [''],
      },
      {
        slug: 'tooling',
        tags: catTooling ?? [''],
      },
    ],
  }

  return transformedProject
}

function getProjectNameSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\.]/gi, '')
    .replace(/[\s\.]+/g, '-')
}

exports.getProjectNameSlug = getProjectNameSlug
