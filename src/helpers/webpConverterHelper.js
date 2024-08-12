const sharp = require('sharp');
const Boom = require('@hapi/boom');

const convertToWebPBuffer = async (inputBuffer) => {
    try {
        const webpBuffer = await sharp(inputBuffer)
            .webp()
            .toBuffer();
        return webpBuffer;
    } catch (error) {
        throw Boom.badData('Error converting image to WebP');
    }
}

module.exports = {
    convertToWebPBuffer,
}