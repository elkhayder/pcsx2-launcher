import { onMounted, ref } from "vue";
import { defineStore } from "pinia";
import GamepadHelper, { IGamepadButtonEventDetail } from "gamepad-helper";
import { useGamesStore } from "./Games";

const ButtonsMap = {
   DPAD_UP: 12,
   DPAD_DOWN: 13,
   DPAD_LEFT: 14,
   DPAD_RIGHT: 15,
   A: 0,
};

export const useGamepadStore = defineStore("gamepad", () => {
   const gamesStore = useGamesStore();

   const selectedGameIndex = ref<number | null>(null);

   let clickedButton: number | null = null;

   let lastActionAt = 0;

   const GameLoop = () => {
      GamepadHelper.update();

      if (clickedButton !== null && Date.now() > lastActionAt + 250) {
         if (handleButton()) lastActionAt = Date.now();
      }

      requestAnimationFrame(GameLoop);
   };

   const handleButton = (): boolean => {
      if (selectedGameIndex.value === null) {
         selectedGameIndex.value = 0;
         return true;
      }

      switch (clickedButton!) {
         case ButtonsMap.DPAD_RIGHT:
            if (selectedGameIndex.value >= gamesStore.games.length - 1) {
               selectedGameIndex.value = 0;
            } else {
               selectedGameIndex.value++;
            }
            return true;

         case ButtonsMap.DPAD_LEFT:
            if (selectedGameIndex.value <= 0) {
               selectedGameIndex.value = gamesStore.games.length - 1;
            } else {
               selectedGameIndex.value--;
            }
            return true;

         case ButtonsMap.A:
            gamesStore.play(gamesStore.games[selectedGameIndex.value]);
            return true;

         default:
            return false;
      }
   };

   onMounted(() => {
      console.log("Gamepad store Mounted");

      GameLoop();

      // @ts-ignore
      document.addEventListener(
         "gamepadbuttondown",
         (event: CustomEvent<IGamepadButtonEventDetail>) => {
            clickedButton = event.detail.button;
         }
      );

      // @ts-ignore
      document.addEventListener(
         "gamepadbuttonup",
         (event: CustomEvent<IGamepadButtonEventDetail>) => {
            if (clickedButton === event.detail.button) {
               clickedButton = null;
               lastActionAt = 0; // Reset
            }
         }
      );
   });

   return {
      selectedGameIndex,
   };
});
