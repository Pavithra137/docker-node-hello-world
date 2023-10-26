exports.filterURL = function filterURL(url) {
    const lcUrl = url.toLowerCase();
    const exts = ['png', 'svg', 'jpeg', 'jpg', 'gif'];
    return exts.some(function (ext) { return lcUrl.endsWith(ext); });
};

exports.sanitizeURL = function sanitizeURL(url) {
    const lcUrl = url.substring(1).toLowerCase();
    const trimUrls = ['/product/detail/', '/product/catalog/', '/cms/'];
    const checkIfExists = trimUrls.some(function (url) { return lcUrl.includes(url); });
    if (checkIfExists) {
        return lcUrl.split('?')[0];
    }
    return lcUrl;
};
