function getStatTestName(type) {

    const map = {
        welch_t_test: "Welch’s t-test",
        student_t_test: "Student's t-test",
        limma: "Limma",
    };

    return map[type] ?? `no type [${type}]`;
}

export {getStatTestName}