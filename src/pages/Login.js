import React from "react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"
import { Form } from "antd"

import yup from "../utils/validation"
import { telPattern } from "../utils"
import BaseLogin from "./BaseLogin"
import Field from "../components/Field"
import ContentCard from "../components/ContentCard"
import PageHeader from "../components/PageHeader"
import BackButton from "../components/BackButton"
import ButtonBar from "../components/ButtonBar"
import OrangeButton from "../components/OrangeButton"

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .nationalId("invalidValue"),
  password: yup
    .string()
    .required()
    .matches(telPattern, "invalidValue"),
})

const SubmitButton = styled(OrangeButton)`
  margin: 34px auto 0 auto;
`

const LoginForm = styled(Form)`
  padding-top: 36px;
`

function Login() {
  const { t } = useTranslation()

  return (
    <ContentCard>
      <PageHeader title={t('login.title')} subtitle={t('login.subtitle')} />
      <BaseLogin validationSchema={validationSchema} errorMsg={t('login.wrongCredentials')}>
        { (loading, error) => (
          <LoginForm layout="vertical">
            { error }
            <Field name="username" title={t("idNumber")} pattern="\d*" disabled={loading} />
            <Field name="password" title={t("phoneNumber")} type="tel" disabled={loading} />
            <ButtonBar style={{ direction: 'rtl' }}>
              <SubmitButton type="submit" disabled={loading}>{t('login.submit')}</SubmitButton>
              <BackButton />
            </ButtonBar>
          </LoginForm>
         ) }
      </BaseLogin>
    </ContentCard>
  )
}

export default Login
