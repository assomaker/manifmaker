Schemas.ValidationComment = new SimpleSchema({
    author: {
        type: String,
        label: "Comment author"
    },
    content: {
        type: String,
        label: "Comment content"
    },
    creationDate:{
        type: Date,
        label: "Comment creation date"
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