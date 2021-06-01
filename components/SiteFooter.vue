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
          <div class="mailchimp-form" v-html="pageData.mailchimp_form"></div>
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
              :href="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="navigation-link">
              {{ link.label }}
            </component>
          </nav>
          <div class="copyright" v-html="pageData.copyright"></div>
        </div>

        <div class="col-4">
          <div class="icons-row" v-html="pageData.icons_row"></div>
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

::v-deep #mailchimp-form {
  .panel-top {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }
  input {
    &[type="email"],
    &[type="submit"] {
      @include borderRadius3;
    }
    &[type="email"] {
      flex: 1;
      background-color: white;
      padding: 0.5rem;
      color: black;
    }
    &[type="submit"] {
      padding: 0 0.75rem;
      margin-left: 0.75rem;
      font-weight: 600;
      background-color: $paradiso;
    }
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
#footer-navigation {
  margin-bottom: 3rem;
}

.navigation-link {
  font-family: $fontMontserrat;
  color: white;
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

::v-deep .icons-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  a {
    width: 2rem;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
  svg {
    width: 100%;
    path {
      fill: white;
    }
  }
}

::v-deep .copyright {
  @include fontSize_Small;
  svg {
    display: inline-block;
    vertical-align: middle;
    width: 1rem;
    margin-right: 0.25rem;
  }
}
</style>
