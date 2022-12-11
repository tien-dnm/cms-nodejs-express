import express from "express";
import isAuth from "../auth/middleware.js";

import {
  getAllUsers,
  getUserById,
  filterUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers.js";

const router = express.Router();
/**
 * @swagger
 * '/v1/user':
 *  get:
 *     tags:
 *     - User
 *     summary: Get all users
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  email_confirmed:
 *                    type: boolean
 *                  phone_number:
 *                    type: string
 *                  phone_number_confirmed:
 *                    type: boolean
 *                  access_failed_count:
 *                    type: integer
 *                  locked_out:
 *                    type: boolean
 *                  locked_out_end:
 *                    type: string
 *                    format: date
 *                  created_date:
 *                    type: string
 *                    format: date
 *                  created_by:
 *                    type: string
 *                  modified_date:
 *                    type: string
 *                    format: date
 *                  modified_by:
 *                    type: string
 *                  is_deleted:
 *                    type: boolean
 *                  deleted_date:
 *                    type: string
 *                    format: date
 *                  deleted_by:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.get("", getAllUsers);
/**
 * @swagger
 * '/v1/user/filter':
 *  get:
 *     tags:
 *     - User
 *     summary: Filter users
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: params
 *        schema:
 *          type: object
 *        style: form
 *        explode: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  email_confirmed:
 *                    type: boolean
 *                  phone_number:
 *                    type: string
 *                  phone_number_confirmed:
 *                    type: boolean
 *                  access_failed_count:
 *                    type: integer
 *                  locked_out:
 *                    type: boolean
 *                  locked_out_end:
 *                    type: string
 *                    format: date
 *                  created_date:
 *                    type: string
 *                    format: date
 *                  created_by:
 *                    type: string
 *                  modified_date:
 *                    type: string
 *                    format: date
 *                  modified_by:
 *                    type: string
 *                  is_deleted:
 *                    type: boolean
 *                  deleted_date:
 *                    type: string
 *                    format: date
 *                  deleted_by:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.get("/filter", filterUsers);
/**
 * @swagger
 * '/v1/user/{id}':
 *  get:
 *     tags:
 *     - User
 *     summary: Get user by id
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique id of the user
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  email_confirmed:
 *                    type: boolean
 *                  phone_number:
 *                    type: string
 *                  phone_number_confirmed:
 *                    type: boolean
 *                  access_failed_count:
 *                    type: integer
 *                  locked_out:
 *                    type: boolean
 *                  locked_out_end:
 *                    type: string
 *                    format: date
 *                  created_date:
 *                    type: string
 *                    format: date
 *                  created_by:
 *                    type: string
 *                  modified_date:
 *                    type: string
 *                    format: date
 *                  modified_by:
 *                    type: string
 *                  is_deleted:
 *                    type: boolean
 *                  deleted_date:
 *                    type: string
 *                    format: date
 *                  deleted_by:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.get("/:id", getUserById);
/**
 * @swagger
 * '/v1/user':
 *  post:
 *     tags:
 *     - User
 *     summary: Create new user
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username.
 *               password:
 *                 type: string
 *                 description: Password.
 *               confirm_password:
 *                 type: string
 *                 description: Password.
 *               email:
 *                 type: string
 *                 description: Email.
 *               phone_number:
 *                 type: string
 *                 description: Phone number
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  email_confirmed:
 *                    type: boolean
 *                  phone_number:
 *                    type: string
 *                  phone_number_confirmed:
 *                    type: boolean
 *                  access_failed_count:
 *                    type: integer
 *                  locked_out:
 *                    type: boolean
 *                  locked_out_end:
 *                    type: string
 *                    format: date
 *                  created_date:
 *                    type: string
 *                    format: date
 *                  created_by:
 *                    type: string
 *                  modified_date:
 *                    type: string
 *                    format: date
 *                  modified_by:
 *                    type: string
 *                  is_deleted:
 *                    type: boolean
 *                  deleted_date:
 *                    type: string
 *                    format: date
 *                  deleted_by:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.post("", createUser);
/**
 * @swagger
 * '/v1/user/{id}':
 *  patch:
 *     tags:
 *     - User
 *     summary: Update a user
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique id of the user
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email.
 *               phone_number:
 *                 type: string
 *                 description: Phone number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *                  email_confirmed:
 *                    type: boolean
 *                  phone_number:
 *                    type: string
 *                  phone_number_confirmed:
 *                    type: boolean
 *                  access_failed_count:
 *                    type: integer
 *                  locked_out:
 *                    type: boolean
 *                  locked_out_end:
 *                    type: string
 *                    format: date
 *                  created_date:
 *                    type: string
 *                    format: date
 *                  created_by:
 *                    type: string
 *                  modified_date:
 *                    type: string
 *                    format: date
 *                  modified_by:
 *                    type: string
 *                  is_deleted:
 *                    type: boolean
 *                  deleted_date:
 *                    type: string
 *                    format: date
 *                  deleted_by:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.patch("/:id", updateUser);
/**
 * @swagger
 * '/v1/user/{id}':
 *  delete:
 *     tags:
 *     - User
 *     summary: Delete a user
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique id of the user
 *        required: true
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: Bad request
 */
router.delete("/:id", deleteUser);
export default router;
