import mongoose from "mongoose";

mongoose.Promise = global.Promise;
/** 
 @swagger
*components:
*    schemas:
*      User:
*        type: object
*        required:
*          - username
*        properties:
*          id:
*            type: string
*            description: The auto-generated id of the user account.
*          username:
*            type: string
*            description: The name of the user account.
*          password_hash:
*            type: string
*            description: Hashed password.
*          password_salt:
*            type: string
*            description: Security salt for password.
*          email:
*            type: string
*            description: The email of the user account.
*          email_confirmed:
*            type: boolean
*            description: Has the email been confirmed?
*          phone_number:
*            type: string
*            description: The phone number of the user account.
*          phone_number_confirmed:
*            type: boolean
*            description: Has the phone number been confirmed?
*          access_failed_count:
*            type: boolean
*            description: The number of times the account login has failed in a row
*          locked_out:
*            type: boolean
*            description: Is the account locked out?
*          locked_out_end:
*            type: string
*            format: date
*            description: Account lockout end date.
*          created_date:
*            type: string
*            format: date
*            description: The date of the record creation.
*          created_by:
*            type: string
*            description: Who created this account.
*          modified_date:
*            type: string
*            format: date
*            description: The date of the record modification.
*          modified_by:
*            type: string
*            description: Who modified this account.
*          is_deleted:
*            type: boolean
*            description: Have this account been deleted.
*          deleted_date:
*            type: string
*            format: date
*            description: The date of the record deletion.
*          deleted_by:
*            type: string
*            description: Who deleted this account.
 */
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: false,
  },
  password_salt: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  email_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
  phone_number_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  access_failed_count: {
    type: Number,
    required: false,
  },
  locked_out: {
    type: Boolean,
    required: false,
    default: false,
  },
  locked_out_end: {
    type: Date,
    required: false,
  },
  created_date: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
  },
  created_by: {
    type: String,
    required: false,
  },
  modified_date: {
    type: Date,
    required: false,
  },
  modified_by: {
    type: String,
    required: false,
  },
  is_deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deleted_date: {
    type: Date,
    required: false,
  },
  deleted_by: {
    type: String,
    required: false,
  },
});

export default mongoose.model("User", userSchema, "user");
