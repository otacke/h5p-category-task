import React, {useContext, useRef} from 'react';
import {useCategoryTask} from "context/CategoryTaskContext";

function Export() {

    const context = useCategoryTask();
    const {
        translate
    } = context;
    const exportContainer = useRef();
    let exportDocument;
    let exportObject;

    function getExportObject() {
        const {
            params: {
                header,
                description = '',
                summaryHeader,
            },
            behaviour: {
                provideSummary = true,
            },
            translations,
            collectExportValues,
        } = context;

        const {
            resources,
            summary,
            userInput
        } = collectExportValues();

        return Object.assign({}, translations, {
            mainTitle: header,
            description,
            summaryHeader,
            hasResources: resources && resources.length > 0,
            useSummary: provideSummary,
            hasSummaryComment: summary && summary.length > 0,
            summaryComment: summary,
            resources: resources,
            unprocessedArguments: userInput.categories
                .filter(category => category.isArgumentDefaultList)
                .map(category => category.connectedArguments)
                .reduce((acc, val) => acc.concat(val), []),
            categories: userInput.categories
                .filter(category => !category.isArgumentDefaultList)
                .map(category => {
                    category.connectedArguments = category.connectedArguments.map(argumentId => userInput.argumentsList[argumentId]);
                    return category;
                })
        });
    }

    function getExportPreview() {
        const documentExportTemplate =
            '<div class="export-preview">' +
            '<div class="page-header" role="heading" tabindex="-1">' +
            ' <h1 class="page-title">{{mainTitle}}</h1>' +
            '</div>' +
            '<div class="page-description">{{description}}</div>' +
            '{{#categories}}' +
            '<table class="page-category-arguments">' +
            '<tr><th>{{title}}</th></tr>' +
            '<tr><td><ul>{{#connectedArguments}}<li>{{argumentText}}</li>{{/connectedArguments}}</ul>{{^connectedArguments}}{{noArguments}}{{/connectedArguments}}</td></tr>' +
            '</table>' +
            '{{/categories}}' +
            '{{#useSummary}}' +
            '<h2>{{summaryHeader}}</h2>' +
            '<p>{{^hasSummaryComment}}{{labelNoSummaryComment}}{{/hasSummaryComment}}{{summaryComment}}</p>' +
            '{{/useSummary}}' +
            '<h2>{{resourceHeader}}</h2>' +
            '{{^resources}}<p>{{labelNoResources}}</p>{{/resources}}' +
            '{{#hasResources}}' +
            '<table class="page-resources">' +
            '<tr><th>{{resourceHeaderTitle}}</th><th>{{resourceHeaderIntro}}</th><th>{{resourceHeaderUrl}}</th></tr>' +
            '{{#resources}}<tr><td>{{title}}</td><td>{{introduction}}</td><td>{{url}}</td></tr>{{/resources}}' +
            '</table>' +
            '{{/hasResources}}' +
            '</div>';

        return Mustache.render(documentExportTemplate, exportObject);
    }

    function handleExport() {
        const {
            translate,
        } = context;

        exportObject = getExportObject();

        context.triggerXAPIScored(0, 0, 'completed');

        exportDocument = new H5P.ExportPage(
            exportObject.mainTitle,
            getExportPreview(),
            true,
            translate('submitText'),
            translate('submitConfirmedText'),
            translate('selectAll'),
            translate('export'),
            H5P.instances[0].getLibraryFilePath('exportTemplate.docx'),
            exportObject
        );
        exportDocument.getElement().prependTo(exportContainer.current);
        H5P.$window.on('resize', () => exportDocument.trigger('resize'));
    }

    return (
        <>
            <button
                className={"h5p-category-task-button-export"}
                onClick={handleExport}
            >
                <span
                    className={"h5p-ri hri-document"}
                    aria-hidden={true}
                />
                {translate('createDocument')}
            </button>
            <div className={"export-container"} ref={exportContainer}/>
        </>
    );
}

export default Export;
