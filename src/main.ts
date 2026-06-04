import "@/styles/index.css";
import { preloadAssets } from "@/assets";
import { createSceneManager } from "@/sceneManager";
import { showCover } from "@/screens/cover/showCover";
import { showMatchThree } from "@/screens/matchThree/showMatchThree";
import { getPixiContainer, initApp } from "@/setupApp";

(async () => {
  const container = getPixiContainer();
  const app = await initApp(container);

  await preloadAssets();

  const scenes = createSceneManager(app);

  const openCover = () => {
    scenes.show(
      showCover(app, {
        onPlay: () => {
          scenes.show(showMatchThree(app, { onBack: openCover }));
        },
      }),
    );
  };

  openCover();
})();
