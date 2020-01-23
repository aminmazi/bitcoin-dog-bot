abstract class BaseController {

    abstract model: any;
  
    // Get all
    getAll = async (req: any, res: any) => {
      try {
        const docs = await this.model.find({});
        res.status(200).json(docs);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  
    // Count all
    count = async (req: any, res: any) => {
      try {
        const count = await this.model.count();
        res.status(200).json(count);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    };
  
    // Insert
    insert = async (model: any) => {
      try {
        const obj = await new this.model(model).save();
        return obj;
      } catch (err) {
        return ({ error: err.message });
      }
    };
  
    // Get by id
    get = async (req: any, res: any) => {
      try {
        const obj = await this.model.findOne({ _id: req.params.id });
        res.status(200).json(obj);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  
    // Update by id
    update = async (model: any) => {
      try {
        this.model.findOneAndUpdate({ _id: model._id }, model);
      } catch (err) {
        console.log(({ error: err.message }));
      }
    };
  
    // Delete by id
    delete = async (req: any, res: any) => {
      try {
        await this.model.findOneAndRemove({ _id: req.params.id });
        res.sendStatus(200);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }
  }
  
  export default BaseController;
