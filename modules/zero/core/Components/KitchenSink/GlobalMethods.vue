<template>
  <section id="global-methods">

    <section id="string-truncation">
      <div class="nested-outline">
        <h3>String Truncation</h3>
      </div>
      <p>{{ truncatedText }}</p>
    </section>

    <section id="tooltip">
      <div class="nested-outline">
        <h3>Tooltip</h3>
        <p>Structure of this tooltip can be found in <code>@/assets/theme/main.scss</code>. Hover over both pieces of text below to see the tooltips appear.</p>
      </div>
      <div class="content inline">
        <p :data-tooltip="tooltipText" data-tooltip-theme="dark">
          Dark themed tooltip: {{ truncatedText }}
        </p>
        <p>|</p>
        <p :data-tooltip="tooltipText" data-tooltip-theme="light">
          Light themed tooltip: {{ truncatedText }}
        </p>
      </div>
    </section>

    <section id="video-iframe-embed">
      <div class="nested-outline">
        <h3>Youtube or Vimeo iframe embed</h3>
        <p>Since it's more intuitive for the user to provide the full URL to a YT/Vimeo video (which is different from the embed URL), we have a function that parses all the different URL formats (ex: Youtube has 3) and to return <code>{ type: 'youtube' or 'vimeo', id, time }</code>. Time refers to a specific video start time. There is also a subsequent function that constructs the embed url from the parsed information and returns the correct embed URL format.</p>
      </div>
      <div class="grid">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="col-6">
          <div class="video-wrapper">
            <iframe
              :src="$buildVideoEmbedUrl($parseVideoUrl(video))"
              allow="autoplay; encrypted-media"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>

  </section>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'KitchenSinkGlobalMethods',

  data () {
    return {
      tooltipText: 'www.longprojectname.com',
      truncatedText: this.$truncateString('www.longprojectname.com', 10, '...', 'double'),
      videos: [
        'https://www.youtube.com/watch?v=54ioUruxkOw',
        'https://vimeo.com/64243464'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
