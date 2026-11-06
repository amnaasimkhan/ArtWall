import { body, validationResult } from "express-validator";

export const validateCreateArtwork = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters long"),

  body("artist_id")
    .notEmpty().withMessage("Artist ID is required")
    .isInt({ min: 1 }).withMessage("Artist ID must be a valid number"),

  body("detail")
    .optional()
    .isLength({ max: 1000 }).withMessage("Detail must not exceed 1000 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("first_url")
    .optional()
    .isURL().withMessage("First image URL must be valid"),

  body("second_url")
    .optional()
    .isURL().withMessage("Second image URL must be valid"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0].msg);
    }
    next();
  }
];

export const validateUpdateArtwork =[
    body("title")
        .notEmpty().withMessage("Title is required")
        .isLength({min:2}).withMessage("Title must be at least 2 characters long"),
    
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0].msg);
    }
    next();
  }
]