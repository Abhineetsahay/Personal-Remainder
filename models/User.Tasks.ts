import mongoose, { Schema, Document } from "mongoose";

export interface Task {
   _id: string;
  taskName: string;
  taskDescription: string;
  taskStartDate: Date;
  taskEndDate: Date;
  taskStartTime: string;
  taskEndTime: string;
  taskStatus:string;
  priority: number;
  links?: string[];
  reminderSent?: boolean;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  tasks: Task[];
}

const TaskSchema = new Schema<Task>({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  taskStartDate: { type: Date, required: true },
  taskEndDate: { type: Date, required: true },
  taskStartTime: { type: String, required: true },
  taskEndTime: { type: String, required: true },
  priority: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], default: 5 },
  taskStatus:{type:String, enum:['Completed','Pending'], default:'Pending'},
  links: { type: [String], default: [] },
  reminderSent: { type: Boolean, default: false },
});

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tasks: { type: [TaskSchema], default: [] },
});

export default mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);
