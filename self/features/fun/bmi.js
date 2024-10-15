module.exports = {
    configuration: {
        name: 'bmi',
        aliases: [''],
        description: 'Shows the body mass index (BMI)',
        syntax: 'bmi <height> <weight>',
        example: 'bmi 5\'10 180',
        module: 'fun'
    },

    run: async (session, message, args) => {

        if (args.length !== 2) {
            return message.react('❌');
        }

        const height = args[0];
        const weight = args[1];

        const heightMatch = height.match(/^(\d+)'(\d+)$/);
        if (!heightMatch) {
            return message.react('❌');
        }

        const feet = parseInt(heightMatch[1]);
        const inches = parseInt(heightMatch[2]);

        const heightInInches = feet * 12 + inches;
        const heightInMeters = heightInInches * 0.0254;

        const weightInPounds = parseFloat(weight);

        if (isNaN(heightInMeters) || isNaN(weightInPounds)) {
            return message.react('❌');
        }

        const bmi = 703 * (weightInPounds / (heightInInches * heightInInches));

        let category;
        if (bmi < 16) {
            category = 'Severe Thinness';
        } else if (bmi >= 16 && bmi < 17) {
            category = 'Moderate Thinness';
        } else if (bmi >= 17 && bmi < 18.5) {
            category = 'Mild Thinness';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
        } else if (bmi >= 30 && bmi < 35) {
            category = 'Obese Class I';
        } else if (bmi >= 35 && bmi < 40) {
            category = 'Obese Class II';
        } else {
            category = 'Obese Class III';
        }

        message.channel.send({ content: ` Your body mass index is **${bmi.toFixed(2)}** and your weight class is **${category}**` })
    }
}