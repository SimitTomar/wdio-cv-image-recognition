export default function createDummyElement(elementLocatorKey, elementPointsOnPage) {

        let dummyElementPointsX = elementPointsOnPage.x + 1;
        let dummyElementPointsY = elementPointsOnPage.y + 1;
        let div = document.createElement('div');
        document.body.append(div);
        div.id = `${elementLocatorKey}Dummy`;
        div.style.position = "absolute";
        div.style.left = `${dummyElementPointsX}px`;
        div.style.top = `${dummyElementPointsY}px`;

}