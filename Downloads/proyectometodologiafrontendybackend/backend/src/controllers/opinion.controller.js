import { AppDataSource } from "../config/configDb.js";
import { OpinionEntity } from "../entity/opinion.entity.js";

export const crearOpinion = async (req, res) => {
  const { opinion } = req.body;

  if (!opinion) {
    return res.status(400).json({ message: "Opinion is required" });
  }

  try {
    const repo = AppDataSource.getRepository(OpinionEntity);
    const newOpinion = repo.create({ opinion });
    await repo.save(newOpinion);
    return res.status(201).json(newOpinion);
  } catch (error) {
    return res.status(500).json({ message: "Error creating opinion", error });
  }
};

export const listarOpiniones = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(OpinionEntity);
    const opiniones = await repo.find();
    return res.status(200).json(opiniones);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching opinions", error });
  }
};

export const eliminarOpinion = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = AppDataSource.getRepository(OpinionEntity);
    const opinion = await repo.findOneBy({ id: parseInt(id) });
    if (!opinion) {
      return res.status(404).json({ message: "Opinion not found" });
    }
    await repo.remove(opinion);
    return res.status(200).json({ message: "Opinion deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting opinion", error });
  }
};

// ...existing code...
