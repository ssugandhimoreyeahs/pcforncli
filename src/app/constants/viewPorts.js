//https://docs.adobe.com/content/help/en/target/using/experiences/vec/mobile-viewports.html

const VIEWPORT = {
    IPHONE: {
       iPhoneXr: {
           width: 414,
           height: 896
           //828W*1792H
       },
       iPhoneXS: {
           width: 375,
           height: 812
       }
    },
    ANDROID: {
        Pixel3: {
            width: 392.8,
            height: 759.3
        }
    }
} 

const DEFAULT_VIEWPORT = VIEWPORT.IPHONE.iPhoneXr
export default DEFAULT_VIEWPORT;