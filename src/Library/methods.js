const electron = require('electron');
const { desktopCapturer } = electron;
const Jimp = require("jimp");
const textract = require('textract');

/**
 * Creates a video stream coming from our 'screen capture', which we can then take a screenshot of.
 * While this does seem silly, it appears to be the best way to take a screenshot.
 */
const takeScreenshot = stream => new Promise((resolve, reject) => {
    // Create and hide the stream/video by positioning it far away 'off screen'
    const video = document.createElement('video');
    video.srcObject = stream;
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

    // Wait until we have enough information to act
    video.onloadedmetadata = (err) => {
        // if (err) {
        //     reject(err);
        // }

        video.style.height = video.videoHeight + 'px';
        video.style.width = video.videoWidth + 'px';

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const screenshot = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, "");
        const buffer = Buffer.from(screenshot, 'base64');
        resolve(buffer);

        video.remove();

        try {
            stream.getTracks()[0].stop();
        } catch (e) {
            reject(e); // Hekcing failed
        }
    };
});

/**
 * Gets the stream of the display the app is on.
 */
const getCurrentDisplayStream = appWindow => new Promise((resolve, reject) => {
    desktopCapturer.getSources({types: ['screen']}, (err, sources) => {
        if (err) {
            return reject(err);
        }

        const bounds = appWindow.getContentBounds();
        for (let source of sources) {
            // Find the videostream of the screen the capture window is located on.
            let display = electron.screen.getDisplayMatching(bounds);
            if (Number(display.id) !== Number(source.id.replace("screen:", ""))) {
                continue;
            }

            const stream = navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id,
                    }
                }
            });

            resolve(stream);
        }

        reject(new Error("No app display found"));
    });
});

/**
 * Trims out the 1px-wide red border, and the 40px high output box.
 */
const adjustBoundsToInset = bounds => ({
    x: bounds.x + 1,
    y: bounds.y + 1,
    width: bounds.width - 2, // Subtracting left and right borders
    height: bounds.height - 42, // Subtracting 'Output' area + bottom and top borders
});

/**
 * Crop the image to the given bounds using Jimp, and greyscale it for more consistent easier OCR'ing.
 */
const cropAndGreyscale = (imageBuffer, bounds) => Jimp.read(imageBuffer)
    .then(image => image
        .crop(bounds.x, bounds.y, bounds.width, bounds.height)
        .greyscale()
        .getBufferAsync(Jimp.MIME_PNG)
    );

/**
 * Uses Tesseract to run OCR on the image
 *
 * macOS/Brew: brew install tesseract --with-all-languages
 */
const recognizeText = (image, lang) => new Promise((resolve, reject) => {
    const options = {
        preserveLineBreaks: true,
        tesseract: {
            lang,
        }
    };

    textract.fromBufferWithMime('image/png', image, options, function(err, text) {
        if (err) {
            return reject(err);
        }

        resolve(text);
    });
});

module.exports = {
    getCurrentDisplayStream,
    takeScreenshot,
    adjustBoundsToInset,
    cropAndGreyscale,
    recognizeText,
};
