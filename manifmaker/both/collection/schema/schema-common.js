Schemas.ValidationComment = new SimpleSchema({
    author: {
        type: String,
        label: "Comment author"
    },
    content: {
        type: String,
        label: "Comment content",
        defaultValue: "No content",
        optional: true
    },
    creationDate:{
        type: Date,
        label: "Comment creation date"
    },
    stateBefore:{
        type: ValidationState,
        label: "Before Validation State"
    },
    stateAfter:{
        type: ValidationState,
        label: "After Validation State"
    }

});

Schemas.Validation = new SimpleSchema({
    currentState: {
        type: ValidationState,
        label: "Current Validation State"
    },
    lastUpdateDate: {
        type: Date,
        label :"Validation last update date"
    },
    comments: {
        type: [Schemas.ValidationComment],
        label: "Validation comment",
    }
});