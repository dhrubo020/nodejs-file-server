import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';
import { IFile } from 'src/interfaces';

const FileSchema = new Schema<IFile>(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },
    mimeType: {
      type: String,
    },
    fileKey: {
      type: String,
    },
    publicKey: {
      type: String,
      index: true,
    },
    privateKey: {
      type: String,
      index: true,
    },
    provider: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const FileModel = model<IFile>('files', FileSchema);
export { FileModel };
