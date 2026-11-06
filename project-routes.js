/**
 * Project slug (URL) ↔ internal data-project id + Published App Store URLs
 * Live Google Play (`android`), Apple App Store (`ios`), Huawei AppGallery (`huawei`),
 * and multi-app suite links (`androidTeacher`, `iosTeacher`) are wired to both homepage cards
 * and case study headers.
 */
window.projectRoutes = {
  bySlug: {
    'zain-sim-swap': {
      id: 'zain',
      index: '01',
      packageId: 'com.iq.zain.posmgmt',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.iq.zain.posmgmt',
        ios: 'https://apps.apple.com/us/app/zain-and-success-partners/id6744289329',
        huawei: 'https://appgallery.huawei.com/app/C114139655'
      }
    },
    'jopetrol-consumer': {
      id: 'jopetrol',
      index: '02',
      packageId: 'com.jopetrol',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.jopetrol',
        ios: 'https://apps.apple.com/us/app/jopetrol-%D8%AC%D9%88%D8%A8%D8%AA%D8%B1%D9%88%D9%84/id6463210238'
      }
    },
    'jopetrol-stations': {
      id: 'jopetrolPos',
      index: '03',
      packageId: 'com.jopetrol.stations',
      stores: false,
      androidOnly: true,
      storeLinks: {}
    },
    'orbex-trading': {
      id: 'orbex',
      index: '04',
      packageId: 'com.orbex.app',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.orbex.app',
        ios: 'https://apps.apple.com/us/app/orbex/id6446580105'
      }
    },
    'edusphere-suite': {
      id: 'edusphere',
      index: '05',
      packageId: 'com.beyond.edusphere',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.beyond.edusphere',
        ios: 'https://apps.apple.com/us/app/edusphere/id6633431798',
        androidTeacher: 'https://play.google.com/store/apps/details?id=com.beyond.EdusphereTeacher',
        iosTeacher: 'https://apps.apple.com/us/app/edusphere-teacher/id6633431849'
      }
    },
    'eihal-telehealth': {
      id: 'eihal',
      index: '06',
      packageId: 'com.eihal.eihalplatform',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.eihal.eihalplatform',
        ios: 'https://apps.apple.com/us/app/eihal/id6751173598?l=ar'
      }
    },
    'wateen': {
      id: 'wateen',
      index: '07',
      packageId: 'com.beyond.wateen',
      stores: true,
      androidOnly: true,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.beyond.wateen'
      }
    },
    'uncle-osaka': {
      id: 'osaka',
      index: '08',
      packageId: 'com.wewebit.uncleosakabeta',
      stores: true,
      androidOnly: false,
      storeLinks: {
        android: 'https://play.google.com/store/apps/details?id=com.wewebit.uncleosakabeta',
        ios: 'https://apps.apple.com/th/app/u-o-orders/id6449182748'
      }
    }
  }
};

window.projectRoutes.byId = Object.fromEntries(
  Object.entries(window.projectRoutes.bySlug).map(([slug, meta]) => [meta.id, { slug, ...meta }])
);
