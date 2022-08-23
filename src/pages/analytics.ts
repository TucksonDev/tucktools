import { RouteLocationNormalized } from "vue-router";

function setPageInfo(pageObj: RouteLocationNormalized) {
    console.log(pageObj);
    if (pageObj.meta?.title) {
        document.title = pageObj.meta.title as string;
    }
}

export default setPageInfo;
