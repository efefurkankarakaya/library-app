import { Dimensions, GestureResponderEvent } from "react-native";

const windowWidth = Dimensions.get("window").width;

export function useSwipe(onSwipeLeft?: any, onSwipeRight?: any, rangeOffset = 4) {
  let firstTouch = 0;

  function onTouchStart(e: GestureResponderEvent) {
    firstTouch = e.nativeEvent.pageX;
    console.log(firstTouch);
  }

  function onTouchEnd(e: GestureResponderEvent) {
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;

    if (positionX - firstTouch > range) {
      onSwipeRight && onSwipeRight();
    } else if (firstTouch - positionX > range) {
      onSwipeLeft && onSwipeLeft();
    }
  }

  return { onTouchStart, onTouchEnd };
}
