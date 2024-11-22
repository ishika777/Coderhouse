import StepName from "../Steps/StepName/StepName";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import styles from "./Activate.module.css"
import React, {useState} from 'react'

const Activate = () => {

    const steps = {
        1 : StepName,
        2 : StepAvatar,
    }

    const [step, setStep] = useState(1);

    const Step = steps[step];

    const onNext = () => {
        setStep(step + 1)
    }

  return (
    <div>
        <Step onNext={onNext} />
    
    </div>
  )
}

export default Activate