const { Project, Step, Tag, User, sequelize } = require('../models');
const imagekit = require('../helpers/imagekit');

class Projects {
  static async Create(req, res, next) {
    const { title, introduction, difficulty, TagId, Names, Description } = req.body;
    const { mainImage, images } = req.files;
    const t = await sequelize.transaction();
    let imagesId = []
    try {
      const projectImage = await imagekit.upload({
        file: mainImage[0].buffer.toString('base64'),
        fileName: mainImage[0].originalname
      })
      imagesId.push(projectImage.fileId);
      const project = await Project.create({
        UserId: req.user.id,
        title: title,
        imgUrl: projectImage.url,
        introduction: introduction,
        difficulty: difficulty,
        TagId: TagId
      }, { transaction: t });

      const promises = images.map((image) => {
        return imagekit.upload({
          file: image.buffer.toString('base64'),
          fileName: image.originalname,
        })
      })
      const imgOutput = await Promise.all(promises);
      imgOutput.forEach(el => {
        imagesId.push(el.fileId);
      })
      let steps = []
      Names.forEach(el => {
        let step = {
          name: el
        }
        steps.push(step);
      })
      console.log(imagesId)
      const output = steps.map((step, index) => {
        step.ProjectId = project.id
        step.description = Description[index]
        step.imgUrl = imgOutput[index].url
        return step
      })
      await Step.bulkCreate(output, { transaction: t })
      await t.commit();
      res.status(201).json({ message: "Project has been created" });
    } catch (err) {
      imagesId.forEach(async (id) => {
        await imagekit.deleteFile(id);
      })
      await t.rollback();
      next(err);
    }
  }

  static async ReadDetail(req, res, next) {
    try {
      let output = await Project.findByPk(req.params.id, {
        include: [{
          model: Tag,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username']
        }, {
          model: Step
        }]
      })
      if (!output) {
        throw ({ name: "project_not_found" })
      }
      res.status(200).json(output);
    } catch (err) {
      next(err)
    }
  }

  static async Read(req, res, next) {
    try {
      const projects = await Project.findAll({
        include: [{
          model: Tag,
          attributes: ['name']
        }, {
          model: User,
          attributes: ['username']
        }]
      })
      res.status(200).json(projects);
    } catch (err) {
      next(err)
    }
  }

  static async SoftDelete(req, res, next) {
    try {
      await Project.update({ status: req.body.status }, { where: { id: req.params.projectid } })
      res.status(200).json({ message: `status has been updated to` });
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Projects;