import { defineClientConfig } from "vuepress/client";
import { defineAsyncComponent, onMounted } from "vue";
import "vuepress-theme-hope/presets/bounce-icon.scss";

const FootMap = defineAsyncComponent(() => import("./components/FootMap.vue"));
const HeroHitokoto = defineAsyncComponent(
  () => import("./components/HeroHitokoto.vue")
);
const Movie = defineAsyncComponent(() => import("./components/Movie.vue"));
const Poem = defineAsyncComponent(() => import("./components/Poem.vue"));

export default defineClientConfig({
  setup() {
    if (typeof document !== "undefined") {
      document.oncontextmenu = function (_) {
        return false;
      };
    }
    onMounted(() => {
      setTimeout(() => {
        console.clear();
      }, 3000);
    });
  },
  rootComponents: [HeroHitokoto],
  enhance: ({ app, router, siteData }) => {
    app.component("FootMap", FootMap);
    app.component("Movie", Movie);
    app.component("Poem", Poem);
  },
});
