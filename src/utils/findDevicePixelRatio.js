export default async function findDevicePixelRatio() {

    return await browser.execute(function () {
        return window.devicePixelRatio
    }).then(function (result) {
        return result.value;
    });
}