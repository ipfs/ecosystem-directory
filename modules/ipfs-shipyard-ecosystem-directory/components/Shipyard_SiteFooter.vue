<template>
  <footer v-if="pageData" id="site-footer">

    <section class="panel-top">
      <div class="grid-spaceBetween-noGutter">

        <div class="col-6_sm-12">
          <h2 class="heading">
            {{ pageData.heading }}
          </h2>
          <div ref="subheading" class="subheading">
            <component
              :is="getElementTag(element.type)"
              v-for="(element, index) in pageData.subheading"
              :key="`subheading-element-${index}`"
              :href="element.href"
              target="_blank"
              class="focus-visible">{{ element.content ? element.content : '' }}</component>
          </div>
        </div>

        <div class="col-5_sm-12">
          <div ref="mailform" class="mailchimp-form">
            <Shipyard_MailchimpForm />
          </div>
        </div>

      </div>
    </section>

    <section class="panel-bottom">
      <div class="grid-spaceBetween-noGutter">

        <div v-if="navigation" class="col-7_sm-12">
          <nav id="footer-navigation">
            <component
              :is="link.type"
              v-for="(link, index) in navigation.footer"
              :key="index"
              :to="link.disabled ? '' : link.href"
              :href="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="navigation-link onhover-opacity focus-visible">
              {{ link.label }}
            </component>
          </nav>
        </div>

        <div class="col-4_sm-12">
          <Shipyard_SocialIcons />
        </div>

        <div class="col-12">
          <div ref="copyright" class="copyright">
            <template v-if="pageData.copyright.length">
              <Shipyard_CopyrightLogo />
              <component
                :is="getElementTag(element.type)"
                v-for="(element, index) in pageData.copyright"
                :key="`copyright-element-${index}`"
                :href="element.href"
                target="_blank"
                class="focus-visible">{{ element.content ? element.content : '' }}</component>
            </template>
          </div>
        </div>

      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ShipyardSiteFooter',

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
  },

  methods: {
    getElementTag (string) {
      switch (string) {
        case 'text':
          return 'span'
        case 'link':
          return 'a'
        default:
          return 'span'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  padding: 4rem 0;
  @include small {
    padding: 2rem 0;
  }
}

::v-deep .subheading,
::v-deep .copyright {
  a {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
  margin-bottom: 4rem;
  @include small {
    margin-bottom: 1rem;
  }
}

.heading {
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: -0.01rem;
}

.subheading {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

::v-deep #mailchimp-form {
  margin-top: 0.5rem;
  @include small {
    margin-top: 1rem;
  }
  .panel-top {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
    @include mini {
      flex-direction: column;
      margin-bottom: 0.5rem;
    }
  }
  .panel-bottom {
    span {
      padding-left: 0.25rem;
    }
  }
  input {
    &[type="email"],
    &[type="submit"] {
      @include borderRadius_Medium;
    }
    &[type="email"] {
      flex: 1;
      padding: 0.5rem;
      line-height: 1.5;
    }
    &[type="submit"] {
      padding: 0 0.75rem;
      margin-left: 1rem;
      font-weight: 600;
      transition: 250ms ease-out;
      @include mini {
        line-height: 1.5;
        padding: 0.5rem;
        margin-left: 0;
        margin-top: 0.5rem;
      }
      &:hover {
        transition: 250ms ease-in;
      }
    }
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
#footer-navigation {
  margin-bottom: 2rem;
  @include small {
    margin-bottom: 0;
  }
  @include mini {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
  }
}

.navigation-link {
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

.social-icons-container {
  @include small {
    margin: 2rem 0;
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
