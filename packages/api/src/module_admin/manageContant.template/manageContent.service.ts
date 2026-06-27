/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import mongoose, { type Schema } from "mongoose";
import {
  AboutContentModel,
  ApplyFormContentModel,
  ContactUsContentModel,
  FaqContentModel,
  HomePageContentModel,
  JobWallContentModel,
  SideMenuContentModel,
} from "../../models";
import { type ApplyFormContent } from "../../models/applyFormContent";
import { FileHandler } from "../../utils/fileHandler";
import {
  type ContactUsOperationField,
  type AboutContentOperationField,
  type HomePageOperationField,
} from ".";
import { type SideMenuContentDoc } from "../../models/manageSideMenuContent";
import { type JobWallContentDoc } from "../../models/manageJobWallContent";

export class ManageContentService {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  // apply form content
  public async getAllApplyFormContent() {
    const result = await ApplyFormContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editApplyFormContent(updatedData: Schema<ApplyFormContent>) {
    return await ApplyFormContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }

  // FAQ content
  public async getAllFAQContent() {
    const result = await FaqContentModel.findOne().populate([
      {
        path: "header.image",
      },
      {
        path: "cards.image",
      },
      {
        path: "iconSection.image",
      },
    ]);
    return result;
  }

  public async editFaqContent(
    updatedData: any,
    operation: "accordion" | "header" | "cards" | "iconSection",
  ) {
    if (operation === "accordion") {
      await FaqContentModel.findOneAndUpdate({}, { $set: { accordion: [] } });
      return await FaqContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }

    if (operation === "iconSection") {
      let finalData: any = {};
      if (updatedData?.media?.image) {
        const image = await this.fileHandler.saveFileAndCreateMedia(
          updatedData.media.image,
        );
        finalData.image = new mongoose.Types.ObjectId(image as string);
      }
      if (updatedData.oldImage) {
        finalData.image = new mongoose.Types.ObjectId(
          updatedData.oldImage as string,
        );
      }
      finalData = { ...finalData, ...updatedData.data };
      return await FaqContentModel.findOneAndUpdate(
        {},
        { iconSection: finalData },
        { new: true, upsert: true },
      );
    }
    if (operation === "header") {
      const { image, ...restData } = updatedData;
      if (restData.oldImage && restData.oldImage !== "null") {
        restData.image = new mongoose.Types.ObjectId(restData.oldImage);
      }
      if (image && image !== "null") {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        const document = await FaqContentModel.findOne();
        if (document && document.header?.image) {
          restData.image = document.header.image.toString();
        }
      }
      return await FaqContentModel.findOneAndUpdate(
        {},
        {
          header: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "cards") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        // eslint-disable-next-line no-console
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          title: updatedData[`objects[${idx}][title]`],
          link: updatedData[`objects[${idx}][link]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImage: updatedData[`objects[${idx}][oldImage]`] ?? null,
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImage) {
          card.image = new mongoose.Types.ObjectId(card.oldImage);
        }
      }
      /* now retrieve cards from db */
      const document = await FaqContentModel.findOne().lean();
      const oldCards: any[] = document?.cards ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await FaqContentModel.findOneAndUpdate(
        {},
        { cards: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  // About content
  public async editAboutContent(
    updatedData: any,
    operation: keyof AboutContentOperationField,
  ) {
    if (operation === "banner") {
      const { text, image, oldImage } = updatedData;
      let media: string | null | any = null;
      if (image) {
        media = await this.fileHandler.saveFileAndCreateMedia(image);
      }
      if (oldImage && oldImage !== "null") {
        media = new mongoose.Types.ObjectId(oldImage as string);
      }
      // Create payload
      const payload: any = {
        text,
      };
      if (media) {
        payload.image = media;
      } else {
        const doc = await AboutContentModel.findOne();
        if (doc && doc.banner?.image) {
          media = doc.banner.image.toString();
          payload.image = media;
        }
      }
      // insert document
      return await AboutContentModel.findOneAndUpdate(
        {},
        { banner: payload },
        { new: true, upsert: true },
      );
    }
    if (operation === "textBlock") {
      return await AboutContentModel.findOneAndUpdate(
        {},
        { textBlock: updatedData },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutFeature") {
      let documentPayload: any = {};
      const {
        aboutFeaturesHeadingFirst,
        aboutFeaturesHeadingSecond,
        aboutFeaturesImage,
        features,
        oldImage,
      } = updatedData;
      if (aboutFeaturesImage) {
        const media =
          await this.fileHandler.saveFileAndCreateMedia(aboutFeaturesImage);
        documentPayload.aboutFeaturesImage = media;
      }
      if (oldImage) {
        documentPayload.aboutFeaturesImage = new mongoose.Types.ObjectId(
          oldImage,
        );
      }
      documentPayload = {
        ...documentPayload,
        aboutFeaturesHeadingFirst,
        aboutFeaturesHeadingSecond,
        features: features.map((item: any) => ({ text: item })),
      };

      return await AboutContentModel.findOneAndUpdate({}, documentPayload, {
        new: true,
        upsert: true,
      });
    }
    if (operation == "marketing") {
      return await AboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }

    if (operation == "youTube") {
      return await AboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "mediaData") {
      return await AboutContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "calender") {
      const { sideImage, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.sideImage = new mongoose.Types.ObjectId(
          restData.oldImages as string,
        );
      }
      if (sideImage) {
        const media = await this.fileHandler.saveFileAndCreateMedia(sideImage);
        restData.sideImage = media;
      } else {
        if (!restData.oldImages && restData.oldImages !== "null") {
          const previousData = await AboutContentModel.findOne();
          restData.sideImage = previousData?.calender.sideImage ?? null;
        }
      }
      return await AboutContentModel.findOneAndUpdate(
        {},
        { calender: restData },
        {
          new: true,
          upsert: true,
        },
      );
    }

    if (operation === "offerCard") {
      let updatedCard: any;
      // Transform card data
      let transformedCard: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        transformedCard.push({
          _id: updatedData[`objects[${idx}][_id]`],
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          url: updatedData[`objects[${idx}][url]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      // filter the actual object
      transformedCard = transformedCard.filter((itm: any) => itm._id);

      const document = await AboutContentModel.findOne().lean();
      const cardsWithMediaId: any[] = [];
      if (document) {
        if (document.OfferCards.length > 0) {
          for (const card of transformedCard) {
            if (card.image) {
              const media = await this.fileHandler.saveFileAndCreateMedia(
                card.image,
              );
              card.image = media;
              card._id = new mongoose.Types.ObjectId(card._id);
            }
            if (card.oldImages) {
              card.image = new mongoose.Types.ObjectId(
                card.oldImages as string,
              );
              card._id = new mongoose.Types.ObjectId(card._id);
            }
            cardsWithMediaId.push(card);
          }

          const card = cardsWithMediaId.map((itm) => {
            if (itm.image) {
              return itm;
            } else {
              const img = document.OfferCards.find(
                (crd) => itm._id.toString() === crd._id?.toString(),
              );
              itm.image = img?.image;
              return itm;
            }
          });
          updatedCard = await AboutContentModel.findOneAndUpdate(
            {},
            { OfferCards: card },
            { new: true, upsert: true },
          );
          return updatedCard;
        } else {
          // Inserting cards in empty
          for (const card of transformedCard) {
            if (card.image) {
              const media = await this.fileHandler.saveFileAndCreateMedia(
                card.image,
              );
              card.image = media;
            }
            const { _id, ...rest } = card;
            cardsWithMediaId.push(rest);
          }
          updatedCard = await AboutContentModel.findOneAndUpdate(
            {},
            { OfferCards: cardsWithMediaId },
            { new: true, upsert: true },
          );
          return updatedCard;
        }
      } else {
        // Inserting cards in empty
        for (const card of transformedCard) {
          if (card.image) {
            const media = await this.fileHandler.saveFileAndCreateMedia(
              card.image,
            );
            card.image = media;
          }
          const { _id, ...rest } = card;
          cardsWithMediaId.push(rest);
        }
        updatedCard = await AboutContentModel.findOneAndUpdate(
          {},
          { OfferCards: cardsWithMediaId },
          { new: true, upsert: true },
        );
        return updatedCard;
      }
    }
    if (operation === "customer") {
      // Transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          url: updatedData[`objects[${idx}][url]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      // Filter the actual object comes from frontend
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      // After filter now save the image in backend and attached mediaId with image property
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.ourCustomers ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          // if old card is exists then push it and replace image if contains in newCard
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        { ourCustomers: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "slider") {
      // Transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.slider ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          // if old card is exists then push it and replace image if contains in newCard
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        { slider: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "exhibitor") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.exhibitors ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        { exhibitors: finalCardForDocument },
        { new: true, upsert: true },
      );
    }
    if (operation === "careerFair") {
      const {
        careerFairFirstHeading,
        careerFairSecondHeading,
        ...restCardData
      } = updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.careerFairCards ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        {
          careerFairCards: finalCardForDocument,
          careerFairFirstHeading,
          careerFairSecondHeading,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "contact") {
      const { contactHeadingFirst, contactHeadingSecond, ...restCardData } =
        updatedData;
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.contactCard ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        {
          contactCard: finalCardForDocument,
          contactHeadingFirst,
          contactHeadingSecond,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "twoCards") {
      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in updatedData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          heading: updatedData[`objects[${idx}][heading]`],
          text: updatedData[`objects[${idx}][text]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          buttonUrl: updatedData[`objects[${idx}][buttonUrl]`],
          buttonText: updatedData[`objects[${idx}][buttonText]`],
          buttonColor: updatedData[`objects[${idx}][buttonColor]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages as string);
        }
      }
      /* now retrieve cards from db */
      const document = await AboutContentModel.findOne().lean();
      const oldCards: any[] = document?.twoCards ?? [];
      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await AboutContentModel.findOneAndUpdate(
        {},
        {
          twoCards: finalCardForDocument,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  public async getAllAboutContent() {
    return await AboutContentModel.findOne().populate([
      { path: "aboutFeaturesImage" },
      { path: "banner.image" },
      { path: "ourCustomers.image" },
      { path: "slider.image" },
      { path: "careerFairCards.image" },
      { path: "exhibitors.image" },
      { path: "contactCard.image" },
      { path: "calender.sideImage" },
      { path: "OfferCards.image" },
      { path: "twoCards.image" },
    ]);
  }

  // contact us content
  public async getAllContactUsContent() {
    return await ContactUsContentModel.findOne().populate([
      {
        path: "aboutUs.sideImage",
      },
      {
        path: "contactCardFirstWithPoints.image",
      },
      {
        path: "ContactCardSecond.image",
      },
      {
        path: "aboutTeamCard.image",
      },
    ]);
  }

  public async editContactUsContent(
    updatedData: any,
    operation: keyof ContactUsOperationField,
  ) {
    if (operation === "pageHeading") {
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          pageHeadingInGermany: updatedData.pageHeadingInGermany,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "addressSection") {
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          address: { ...updatedData },
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutUs") {
      const { sideImage, ...restData } = updatedData;
      if (restData.oldImages && restData.oldImages !== "null") {
        restData.sideImage = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (sideImage) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(sideImage);
        restData.sideImage = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await ContactUsContentModel.findOne();
          if (document && document.aboutUs?.sideImage) {
            restData.sideImage = document.aboutUs.sideImage.toString();
          }
        }
      }
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          aboutUs: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "counter") {
      const { counterHeading, counters } = updatedData;
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        { counterHeading, counters },
        { new: true, upsert: true },
      );
    }
    if (operation === "contactCardFirstWithPoints") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await ContactUsContentModel.findOne();
          if (document && document.contactCardFirstWithPoints?.image) {
            restData.image =
              document?.contactCardFirstWithPoints?.image?.toString();
          }
        }
      }
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          contactCardFirstWithPoints: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "ContactCardSecond") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages && restData.oldImages === "null") {
          const document = await ContactUsContentModel.findOne();
          if (document && document.ContactCardSecond?.image) {
            restData.image = document.ContactCardSecond.image.toString();
          }
        }
      }
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          ContactCardSecond: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "aboutTeam") {
      const { aboutTeamHeading, aboutTeamSubHeading, ...restCardData } =
        updatedData;
      // Transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in restCardData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          heading: updatedData[`objects[${idx}][heading]`],
          subHeading: updatedData[`objects[${idx}][subHeading]`],
          buttonText: updatedData[`objects[${idx}][buttonText]`],
          buttonUrl: updatedData[`objects[${idx}][buttonUrl]`],
          buttonColor: updatedData[`objects[${idx}][buttonColor]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages);
        }
        if (card.image && !card.oldImages) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
      }
      /* now retrieve cards from db */
      const document = await ContactUsContentModel.findOne().lean();
      const oldCards: any[] = document?.aboutTeamCard ?? [];

      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard) {
          // if old card is exists then push it and replace image if contains in newCard
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, ...restData }) => restData,
      );
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          aboutTeamCard: finalCardForDocument,
          aboutTeamHeading,
          aboutTeamSubHeading,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "contactForm") {
      return await ContactUsContentModel.findOneAndUpdate(
        {},
        {
          contactForm: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  /* Home page content v2 */
  public async editHomePageV2Content(
    updatedData: any,
    operation: keyof HomePageOperationField,
  ) {
    if (operation === "cardSection") {
      const { cardHeading, cardText, CardBackgroundColor, ...restData } =
        updatedData;

      // transform card data
      let transformedCardContainImage: any[] = [];
      let idx = 0;
      for (const _reqData in restData) {
        transformedCardContainImage.push({
          _id: updatedData[`objects[${idx}][_id]`],
          image: updatedData[`objects[${idx}][image]`] ?? null,
          link: updatedData[`objects[${idx}][link]`],
          oldImages: updatedData[`objects[${idx}][oldImages]`],
        });
        idx = idx + 1;
      }
      /* filter the actual object comes from frontend */
      transformedCardContainImage = transformedCardContainImage.filter(
        (itm: any) => itm._id,
      );
      /* after filter now save the image in backend and attached mediaId with image property */
      for (const card of transformedCardContainImage) {
        if (card.image) {
          const media = await this.fileHandler.saveFileAndCreateMedia(
            card.image,
          );
          card.image = media;
        }
        if (card.oldImages) {
          card.image = new mongoose.Types.ObjectId(card.oldImages);
        }
      }
      /* now retrieve cards from db */
      const document = await HomePageContentModel.findOne().lean();
      const oldCards: any[] = document?.cards ?? [];
      /* push update frontend cards over old cards */
      /* first check transformedCardContainImage cards exists in Cards */
      let finalCardForDocument: any[] = [];
      for (const newCard of transformedCardContainImage) {
        /* this line find the newCard in oldCards */
        const oldCard = oldCards.find(
          (card) => card._id?.toString() === newCard._id.toString(),
        );
        if (oldCard?.oldImages) {
          oldCard.image = oldCard?.oldImages;
        }
        if (newCard?.oldImages) {
          newCard.image = oldCard?.oldImages;
        }
        if (oldCard) {
          /* if old card is exists then push it and replace image if contains in newCard */
          finalCardForDocument.push({
            ...newCard,
            image: newCard?.image || oldCard?.image || null,
          });
        } else {
          finalCardForDocument.push({
            ...newCard,
          });
        }
      }
      /* remove all _id */
      finalCardForDocument = finalCardForDocument.map(
        ({ _id, oldImages, ...restData }) => {
          if (oldImages) {
            restData.image = new mongoose.Types.ObjectId(oldImages);
          }
          return restData;
        },
      );
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          cards: finalCardForDocument,
          cardHeading,
          cardText,
          CardBackgroundColor,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "youtubeSection") {
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          youtubeSection: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "searchBar") {
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          searchBar: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "topState") {
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          topState: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "federalState") {
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          federalState: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "gallery") {
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          gallery: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "textContainer") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData.oldImages) {
          const document = await HomePageContentModel.findOne();
          if (document && document.textContainer?.image) {
            restData.image = document.textContainer.image.toString();
          }
        }
      }
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          textContainer: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "emailSection") {
      const { image, ...restData } = updatedData;
      if (restData.oldImages) {
        restData.image = new mongoose.Types.ObjectId(restData.oldImages);
      }
      if (image) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(image);
        restData.image = mediaId;
      } else {
        if (!restData?.oldImages) {
          const document = await HomePageContentModel.findOne();
          if (document && document.mailChimpSection?.image) {
            restData.image = document.mailChimpSection.image.toString();
          }
        }
      }
      return await HomePageContentModel.findOneAndUpdate(
        {},
        {
          mailChimpSection: restData,
        },
        { new: true, upsert: true },
      );
    }
    if (operation === "companiesLogo") {
      return await HomePageContentModel.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
      });
    }
    if (operation === "headerLogoSideImage") {
      const {
        headerLogoSideImage,
        sideImage,
        oldImageHeaderLogoSideImage,
        oldSideImage,
      } = updatedData;

      const updateFields: any = {};
      if (oldImageHeaderLogoSideImage) {
        updateFields.headerLogoSideImage = new mongoose.Types.ObjectId(
          oldImageHeaderLogoSideImage,
        );
      }

      if (oldSideImage) {
        updateFields.logoSideImage = new mongoose.Types.ObjectId(oldSideImage);
      }

      if (sideImage) {
        const imageId =
          await this.fileHandler.saveFileAndCreateMedia(sideImage);
        updateFields.logoSideImage = imageId;
      }
      if (headerLogoSideImage) {
        const mediaId =
          await this.fileHandler.saveFileAndCreateMedia(headerLogoSideImage);
        updateFields.headerLogoSideImage = mediaId;
      }

      const updatedDocument = await HomePageContentModel.findOneAndUpdate(
        {},
        updateFields,
        { new: true, upsert: true },
      );

      return updatedDocument; // Ensure the updated document is returned
    }
    if (operation === "welcomeMessageForApp") {
      await HomePageContentModel.findOneAndUpdate(
        {},
        {
          welcomeMessageForApp: updatedData,
        },
        { new: true, upsert: true },
      );
    }
    return null;
  }

  public async getAllHomePageV2Content() {
    return await HomePageContentModel.findOne().populate([
      {
        path: "cards.image",
      },
      {
        path: "textContainer.image",
      },
      {
        path: "mailChimpSection.image",
      },
      {
        path: "headerLogoSideImage",
      },
      {
        path: "logoSideImage",
      },
    ]);
  }

  // Side menu content
  public async sideMenuContent(data: SideMenuContentDoc) {
    const sideMenuContent = await SideMenuContentModel.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
      },
    );
    return sideMenuContent;
  }

  public async getSideMenuContent() {
    const result = await SideMenuContentModel.findOne();
    return result;
  }

  // Job wall content
  public async jobWallContent(data: JobWallContentDoc) {
    const jobWallContent = await JobWallContentModel.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
      },
    );
    return jobWallContent;
  }

  public async getJobWallContent() {
    const result = await JobWallContentModel.findOne();
    return result;
  }
}
