import type { NextApiRequest, NextApiResponse } from "next";
import { Register, EmailToken } from "@/ts/userInterface";
import validator from "validator";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import connectDB from "@/controller/connectDB";
import Email from "@/models/email";
import User from "@/models/user";
import bcrypt from "bcrypt";

sgMail.setApiKey(process.env.SENGRID_KEY as string);

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name, email, password }: Register = req.body;

    // validate
    if (validator.isEmpty(name)) {
      return res.json({ error: "name required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ error: "email required" });
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      return res.json({ error: "password required" });
    }

    //check user is exited
    await connectDB();
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.json({ error: "user email is existed" });
    }

    // check if exist email
    const exitedEmail = await Email.findOne({ email });
    if (exitedEmail) {
      return res.json({
        error: "email is already register, please check your email inbox",
      });
    }
    // create email for pre register
    const preRegister = await Email.create({ email, type: "Register" });

    // send mail
    const token = jwt.sign(
      { name, email: preRegister.email, password },
      process.env.NEXTAUTH_SECRET as string
    );
    const URL = `${process.env.NEXTAUTH_URL}/auth/register/${token}`;
    interface Msg {
      to: string;
      from: string;
      subject: string;
      html: string;
    }
    const msg: Msg = {
      to: email,
      from: `Ugly shop <${process.env.EMAIL_FROM}>`,
      subject: "Register comfirmation from next-ecommerce",
      html: `<h2>Dear next-ecommerce customer</h2>
      <p>We have receive a request to authorize this email address. If you requested this varification, please clik this Verify button or follow URL</p>
      <button style="display: block; margin: auto; width: 200px; height: 50px; cursor: pointer">
        <a href="${URL}" style="text-decoration: none; font-size: 24px">Verify</a>
      </button>
      <p><a href="${URL}">${URL}</a></p>
      <p>If you did NOT request to verify this email address, do not action on this email</p>
      <p>Sincerely</p>
      <p>The next-ecommerce Services Team</p>
      `,
    };
    await sgMail.send(msg);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.json({ error: "error by catch register" });
  }
};

export const verifyRegister = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const token = req.query?.token as string;

    const { email, password, name }: EmailToken = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string
    ) as EmailToken;
    const matchEmail = await Email.findOne({ email: email, type: "Register" });
    if (matchEmail) {
      const passwordHass = await bcrypt.hash(password, 10);
      await User.create({
        name: name,
        email: matchEmail.email,
        password: passwordHass,
      });
      await Email.findOneAndDelete({ email: email });
      res.json({ ok: true, email, password });
    } else {
      res.json({
        error: "you token is expired, please register again",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "has error by verifyRegister, please register again" });
  }
};

export const signin = async (email: string, password: string) => {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not found");
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("password wrong");

    const doc = user._doc;
    delete doc.password;
    return doc;
};

export const roleCheck = async (email: string) => {
  try {
    connectDB();
    const { role } = await User.findOne({ email }).select("role");
    return role;
  } catch (error) {
    console.log(error);
  }
};

export const recovery = async(req: NextApiRequest, res: NextApiResponse) => {
  // console.log(req.body)
  try{
    const {email} = req.body
    await connectDB()

     //check user is exited
    const exitedUser = await User.findOne({email})
    if(!exitedUser){
      return res.json({error: 'user not found, please register'})
    }

    // check if exist email
    const exitedEmail = await Email.findOne({ email });
    if (exitedEmail) {
      return res.json({
        error: "email is already recovery, please check your email inbox",
      });
    }

    // create email for pre register
    const preRecovery = await Email.create({ email, type: "Forget" });

    // send mail
    const token = jwt.sign(
      { email: preRecovery.email },
      process.env.NEXTAUTH_SECRET as string
    );
    const URL = `${process.env.NEXTAUTH_URL}/auth/recovery/${token}`;
    interface Msg {
      to: string;
      from: string;
      subject: string;
      html: string;
    }
    const msg: Msg = {
      to: email,
      from: `Ugly shop <${process.env.EMAIL_FROM}>`,
      subject: "Recovery comfirmation from next-ecommerce",
      html: `<h2>Dear next-ecommerce customer</h2>
      <p>We have receive a request to recovery this email address. If you requested this varification, please clik this Verify button or follow URL</p>
      <button style="display: block; margin: auto; width: 200px; height: 50px; cursor: pointer">
        <a href="${URL}" style="text-decoration: none; font-size: 24px">Verify</a>
      </button>
      <p><a href="${URL}">${URL}</a></p>
      <p>If you did NOT request to verify recovery this email address, do not action on this email</p>
      <p>Sincerely</p>
      <p>The next-ecommerce Services Team</p>
      `,
    };
    await sgMail.send(msg);
    res.json({ ok: true });

  }
  catch(error){
    console.log('error by controller/user/recovery => ', error)
    res.send({error: 'error by catch'})
  }
}

export const verifyRecovery = async(req: NextApiRequest, res: NextApiResponse) => {
  
  try{
    const token = req.query.token as string
    // console.log('token is => ', token)
    const {email} = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as {email: string}
    // console.log('email is => ', email)
    const result = await Email.findOne({email, type: 'Forget'})
    if(!result){
      res.json({error: 'email not match'})
    }else{
      res.json({ok: true, email})
    }

  }catch(error){
    console.log('error by catch controller.user.verifyRecovery => ', error)
    res.json({error: 'error by catch controller.user.verifyRecovery'})
  }
}

export const changeUserPassword = async(req: NextApiRequest, res: NextApiResponse) => {
  try{
    const {email, password} = req.body
    const passwordHass = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate({email}, {password: passwordHass})
    await Email.findOneAndDelete({email})
    res.json({ok: true, email, password})
  }catch(error){
    console.log('error by catch controller.user.changeUserPassword => ', error)
    res.json({error: 'error by catch controller.user.changeUserPassword'})
  }
}

