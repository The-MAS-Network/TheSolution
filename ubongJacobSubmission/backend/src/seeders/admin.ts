import bcrypt from "bcrypt";
import Joi, { Schema } from "joi";
import { message } from "../middlewares/utility";
import getAppConfig from "../utilities/appConfig";
import { Mailer } from "../utilities/sendEmail";

import { welcomeEmail } from "../emails/welcomeEmail";
import dataSource from "../db/data-source";
import { Admins } from "../entities/admin/Admins.entity";

async function createAdmin() {
  const { app_admin_email: email, resend_email_domain } = getAppConfig();
  const { error } = validateReq({ email });

  if (error) {
    console.log(message(false, error.details[0].message));
    return process.exit(0);
  }

  const adminsRepository = dataSource.getRepository(Admins);

  const admins = await adminsRepository.find();

  const result = admins[0];

  if (!!result) {
    console.log(
      message(false, `Admin with the details ${result?.email} already exists.`)
    );
    return process.exit(0);
  }

  const password = "123456";

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = adminsRepository.create({ email, password: hashedPassword });
  await adminsRepository.save(admin);

  await Mailer?.emails?.send({
    from: resend_email_domain,
    to: [email],
    subject: "Onboarding message.",
    html: welcomeEmail({ email, password }),
  });

  console.log(`🙂 Default admin created successfully.`);

  return process.exit(0);
}

const init = async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to Mysql");

    await createAdmin();
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
};

init();

interface DataSchema {
  email: string;
}

function validateReq(value: DataSchema) {
  const data: Partial<Record<keyof DataSchema, Schema>> = {
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: false,
      })
      .min(3)
      .max(250),
  };
  const schema = Joi.object<DataSchema>(data);
  return schema.validate(value);
}
