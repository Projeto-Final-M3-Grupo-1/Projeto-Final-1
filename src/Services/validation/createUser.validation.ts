import * as yup from "yup";

export const schemaUserLogin = yup.object().shape({
    email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
    password: yup.string(),
});
