module.exports = {
  async afterUpdate(event) {
    const { result } = event;
    let subject = "";
    let message = "";

    // Fetch the full entry with populated relational fields
    const populatedResult = await strapi.documents("api::asset.asset").findOne({
      documentId: result.documentId,
      populate: {
        uploadedBy: {
          fields: ["name", "username", "email"],
        },
        project: {
          populate: {
            author: {
              fields: ["name", "username", "email"],
            },
          },
        },
      }, // Populate the `uploadedBy` relation
    });

    // Now you can access the relational fields
    if (populatedResult.approvalStatus === "accepted") {
      subject = "Assets approved";
      message = "Hi, your project assets have been approved by our team";
    }

    if (populatedResult.approvalStatus === "rejected") {
      subject = "Assets rejected";
      message = "Hi, your project assets have been rejected by our team";
    }

    await strapi
      .service("api::backend-services.backend-services")
      .sendNotification({
        channel: ["email", "dashboard"],
        subject: subject,
        message: message,
        receiver: {
          email: populatedResult.project.author.email,
          userDocumentId: populatedResult.project.author.documentId,
        },
      });
  },
};
