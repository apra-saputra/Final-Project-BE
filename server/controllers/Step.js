const { Step } = require("../models");
const imagekit = require("../helpers/imagekit");

class StepControl {
  static async Update(req, res, next) {
    const { Names, Description } = req.body;
    const { projectid, stepid } = req.params;
    const { image } = req.files;
    let imagesId;
    try {
      const stepImage = await imagekit.upload({
        file: image[0].buffer.toString("base64"),
        fileName: image[0].originalname,
      });
      console.log(stepImage, "<<<<<<<<<<<<<<<<<");
      imagesId = stepImage.fileId;

      const output = {
        ProjectId: projectid,
        name: Names,
        description: Description,
        imgUrl: stepImage.url,
      };

      await Step.update(output, { where: { id: stepid } });
      res.status(200).json({ message: "Step has been updated" });
    } catch (err) {
      if (imagesId) {
        imagekit.deleteFile(imagesId);
      }
      next(err);
    }
  }
}

module.exports = StepControl;
