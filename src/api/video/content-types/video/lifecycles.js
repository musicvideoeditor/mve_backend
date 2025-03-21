async function updateVideoUrl(documentId, url) {
  try {
    const updatedUrl = url.replace("/play/", "/embed/");
    const res = await strapi.documents("api::video.video").update({
      documentId: documentId,
      data: {
        videoUrl: url,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  afterCreate: async (event) => {
    const { result } = event;

    if (result.source == "bunny" && result.videoUrl.includes("/embed/"))
      return true;

    await updateVideoUrl(result.documentId, result.videoUrl);
  },

  beforeCreate: async (event) => {
    const { result } = event;

    if (result.source == "bunny" && result.videoUrl.includes("/embed/"))
      return true;

    await updateVideoUrl(result.documentId, result.videoUrl);
  },
};
