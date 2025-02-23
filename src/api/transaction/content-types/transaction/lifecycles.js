module.exports = {
  afterCreate: async (event) => {
    const { result } = event;

    // Fetch the full entry with populated relational fields
    const populatedResult = await strapi
      .documents("api::transaction.transaction")
      .findOne({
        documentId: result.documentId,
        fields: ['amount'],
        populate: {
          paidBy: {
            fields: ["name", "username", "email"],
          },
        }, // Populate the `paidBy` relation
      });

    // Now you can access the relational fields
    if (populatedResult.paymentStatus === "pending") {
      await strapi
        .service("api::backend-services.backend-services")
        .sendNotification({
          channel: ["email", "dashboard"],
          subject: "Payment pending",
          message: `Hi, your payment of ₹${populatedResult.amount} is pending`,
          receiver: {
            email: populatedResult.paidBy.email,
            userDocumentId: populatedResult.paidBy.documentId,
          },
          additionalParams: {
            ctaUrl: `/dashboard/transactions/${populatedResult.documentId}`,
            ctaLabel: "View transaction",
          },
        });
    }
  },
};
