import mongoose from "mongoose";

mongoose.Promise = global.Promise;
/** 
 @swagger
*components:
*    schemas:
*      Refresh Token:
*        type: object
*        required:
*          - user_id
*          - token
*        properties:
*          id:
*            type: string
*            description: The auto-generated id of the record.
*          user_id:
*            type: string
*            description: The id of the user.
*          token:
*            type: string
*            description: The refresh token.
*          is_revoked:
*            type: string
*            description: Is the refresh token revoked.
*          expires:
*            type: string
*            format: date
*            description: The expires time of the refresh token.
*          is_used:
*            type: boolean
*            description: Is the refresh token used?
 */
const refreshTokenSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  is_revoked: {
    type: Boolean,
    required: false,
  },
  expires: {
    type: Date,
    required: false,
  },
  is_used: {
    type: Boolean,
    required: false,
  },
});
export default mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "refresh_token"
);
