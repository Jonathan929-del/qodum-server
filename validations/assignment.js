// Validate create assignment
export const validateCreateAssignment = ({subject, class_name, title, attachment, description}) => {
    const errors = {};

    // Subject
    if(subject.trim() === '' || !subject){
        errors.subject = 'Please select a subject';
    };
    // Class name
    if(class_name.trim() === '' || !class_name){
        errors.class_name = 'Please select a class';
    };
    // Title
    if(title.trim() === '' || !title){
        errors.title = 'Please enter a title';
    };
    // Attachment
    if(attachment.trim() === '' || !attachment){
        errors.attachment = 'Please enter an attachment';
    };
    // Description
    if(description.trim() === '' || !description){
        errors.description = 'Please enter description';
    };
    return {
        errors,
        valid:Object.keys(errors).length < 1
    }
};