<template>
  <header v-if="pageData" id="site-footer">

    <section class="panel-top">
      <div class="grid-noGutter-spaceBetween">

        <div class="col-6">
          <h2 class="heading">
            {{ pageData.heading }}
          </h2>
          <div class="subheading" v-html="pageData.subheading"></div>
        </div>

        <div class="col-5">
          <div class="placeholder-section no-margin tiny">
            Form
          </div>
        </div>

      </div>
    </section>

    <section class="panel-bottom">
      <div class="grid-noGutter-spaceBetween">

        <div v-if="navigation" class="col-7">
          <nav id="footer-navigation">
            <component
              :is="link.type"
              v-for="(link, index) in navigation.footer"
              :key="index"
              :to="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="footer-navigation-link">
              {{ link.label }}
            </component>
          </nav>
          <div class="copyright" v-html="pageData.copyright"></div>
        </div>

        <div class="col-4">
          <div class="placeholder-section no-margin tiny">
            Icons
          </div>
        </div>

      </div>
    </section>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      navigation: 'global/navigation'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('general')) {
        return siteContent.general.footer_content
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  padding: 3rem 0;
  background: linear-gradient(180deg,#041727 0,#062B3F);
  color: white;
}

::v-deep .subheading,
::v-deep .copyright {
  a {
    color: $paradiso;
  }
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
  margin-bottom: 5rem;
}

.heading {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

// .panel-top-content {
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// }
//
// #header-logo {
//   img {
//     width: 8.625rem;
//   }
// }

// ////////////////////////////////////////////////////////////// [Panel] Bottom
#footer-navigation {
  margin-bottom: 3rem;
}

.footer-navigation-link {
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

::v-deep .copyright {
  @include fontSize_Small;
  svg {
    width: 16px;
  }
}

// .heading {
//   font-weight: 600;
// }
//
// .subheading {
//   @include fontSize_Large;
// }
</style>
